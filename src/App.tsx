import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createBlankProject, createDemoProject, addPath, addStationToPath, insertStationToPath, createStation, updatePath, updateStation, removeStation } from '@utils/project';
import { buildPath, snapToGrid } from '@utils/geometry';
import { exportAsPng, exportAsRmg, exportAsSvg } from '@utils/exporter';
import type { ContentData, Path, Station, StationAlignment, StationPosition, StationStyle } from '@types';

const App: React.FC = () => {
  const [project, setProject] = useState<ContentData>(() => createDemoProject());
  const [selectedPathId, setSelectedPathId] = useState<number>(0);
  const [selectedStation, setSelectedStation] = useState<{ pathId: number; stationIndex: number } | null>(null);
  const [tool, setTool] = useState<'select' | 'add' | 'insert'>('select');
  const [dragging, setDragging] = useState<{ pathId: number; stationIndex: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, width: 2000, height: 2000 });
  const [panning, setPanning] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getViewportMetrics = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const scale = Math.min(rect.width / view.width, rect.height / view.height);
    const displayWidth = view.width * scale;
    const displayHeight = view.height * scale;
    const offsetX = rect.left + (rect.width - displayWidth) / 2;
    const offsetY = rect.top + (rect.height - displayHeight) / 2;
    return { rect, scale, displayWidth, displayHeight, offsetX, offsetY };
  };

  const builtPaths = useMemo(() => project.pathInfo.map(buildPath), [project]);
  const stationCount = useMemo(() => project.pathInfo.reduce((acc, path) => acc + path.stations.length, 0), [project]);

  useEffect(() => {
    setView({ x: 0, y: 0, width: project.width, height: project.height });
  }, [project.width, project.height]);

  useEffect(() => {
    if (!project.pathInfo.find((p) => p.id === selectedPathId)) {
      setSelectedPathId(project.pathInfo[0]?.id ?? 0);
    }
  }, [project, selectedPathId]);

  const selectedPath: Path | undefined = useMemo(() => project.pathInfo.find((p) => p.id === selectedPathId) ?? project.pathInfo[0], [project, selectedPathId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedStation && selectedPathId === selectedStation.pathId) {
          handleStationRemove(selectedStation.stationIndex);
        }
      }
      if (e.key === 'Escape') {
        setSelectedStation(null);
        setTool('select');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedStation, selectedPathId]);

  const handleNew = () => setProject(createBlankProject());
  const handleDemo = () => setProject(createDemoProject());
  const handleAddPath = () => setProject((prev) => addPath(prev));
  const handleRenamePath = (id: number, name: string) => setProject((prev) => updatePath(prev, id, (p) => ({ ...p, name })));
  const handlePathStyle = (id: number, patch: Partial<Path>) => setProject((prev) => updatePath(prev, id, (p) => ({ ...p, ...patch })));
  const handleStationEdit = (index: number, patch: Partial<Station>) => {
    if (!selectedPath) return;
    setProject((prev) => updatePath(prev, selectedPath.id, (p) => updateStation(p, index, patch)));
  };
  const handleStationRemove = (index: number) => {
    if (!selectedPath) return;
    setProject((prev) => updatePath(prev, selectedPath.id, (p) => removeStation(p, index)));
    setSelectedStation(null);
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ContentData;
      if (data?.pathInfo) {
        setProject(data);
        setSelectedPathId(data.pathInfo[0]?.id ?? 0);
        setSelectedStation(null);
      }
    } catch (err) {
      console.error('Failed to import project', err);
    }
  };

  const handleExportRmg = () => exportAsRmg(project, project.name || 'project');
  const handleExportSvg = () => {
    if (svgRef.current) exportAsSvg(svgRef.current, project.name || 'map');
  };
  const handleExportPng = () => {
    if (svgRef.current) exportAsPng(svgRef.current, project.name || 'map', { background: '#ffffff', scale: 2 });
  };

  const screenToSvg = (clientX: number, clientY: number) => {
    const metrics = getViewportMetrics();
    if (!metrics) return null;
    const { displayWidth, displayHeight, offsetX, offsetY } = metrics;
    const nx = (clientX - offsetX) / displayWidth;
    const ny = (clientY - offsetY) / displayHeight;
    const x = view.x + nx * view.width;
    const y = view.y + ny * view.height;
    return { x, y };
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!selectedPath) return;
    const pt = screenToSvg(e.clientX, e.clientY);
    if (!pt) return;
    const x = snapToGrid(pt.x);
    const y = snapToGrid(pt.y);

    if (tool === 'add') {
      const station = createStation(x, y);
      setProject((prev) => updatePath(prev, selectedPath.id, (p) => addStationToPath(p, station)));
      setSelectedStation({ pathId: selectedPath.id, stationIndex: selectedPath.stations.length });
      return;
    }

    if (tool === 'insert') {
      const target = findInsertTarget(selectedPath, x, y);
      if (!target) {
        const station = createStation(x, y);
        setProject((prev) => updatePath(prev, selectedPath.id, (p) => addStationToPath(p, station)));
        setSelectedStation({ pathId: selectedPath.id, stationIndex: selectedPath.stations.length });
        return;
      }
      const station = createStation(snapToGrid(target.px), snapToGrid(target.py));
      setProject((prev) => {
        return updatePath(prev, selectedPath.id, (p) => insertStationToPath(p, station, target.index));
      });
      setSelectedStation({ pathId: selectedPath.id, stationIndex: target.index + 1 });
      return;
    }

    setSelectedStation(null);
  };

  const findInsertTarget = (path: Path, x: number, y: number) => {
    if (path.stations.length < 2) return null;
    let best: { index: number; px: number; py: number; dist2: number } | null = null;
    for (let i = 0; i < path.stations.length - 1; i++) {
      const a = path.stations[i];
      const b = path.stations[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) continue;
      let t = ((x - a.x) * dx + (y - a.y) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const px = a.x + t * dx;
      const py = a.y + t * dy;
      const dist2 = (x - px) * (x - px) + (y - py) * (y - py);
      if (!best || dist2 < best.dist2) best = { index: i, px, py, dist2 };
    }
    return best;
  };

  const handlePointerDown = (pathId: number, stationIndex: number) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setSelectedPathId(pathId);
    setSelectedStation({ pathId, stationIndex });
    setTool('select');
    setDragging({ pathId, stationIndex });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (panning) {
      const metrics = getViewportMetrics();
      if (!metrics) return;
      const dx = e.clientX - panning.x;
      const dy = e.clientY - panning.y;
      const wx = view.x - dx / metrics.scale;
      const wy = view.y - dy / metrics.scale;
      setPanning({ x: e.clientX, y: e.clientY });
      setView((v) => ({ ...v, x: wx, y: wy }));
      return;
    }

    const pt = screenToSvg(e.clientX, e.clientY);
    if (pt) setHover({ x: snapToGrid(pt.x), y: snapToGrid(pt.y) });

    if (!dragging) return;
    if (!pt) return;
    const x = snapToGrid(pt.x);
    const y = snapToGrid(pt.y);
    setProject((prev) => updatePath(prev, dragging.pathId, (p) => updateStation(p, dragging.stationIndex, { x, y })));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDragging(null);
  };

  const handlePanStart = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button === 1 || e.button === 2 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setPanning({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePanEnd = () => setPanning(null);

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    const metrics = getViewportMetrics();
    if (!metrics) return;

    if (!(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setView((v) => ({
        ...v,
        x: v.x - e.deltaX / metrics.scale,
        y: v.y - e.deltaY / metrics.scale
      }));
      return;
    }

    e.preventDefault();
    const pt = screenToSvg(e.clientX, e.clientY);
    if (!pt) return;
    const zoom = Math.exp(-e.deltaY * 0.0015);
    const newWidth = Math.max(100, Math.min(project.width * 4, view.width / zoom));
    const newHeight = Math.max(100, Math.min(project.height * 4, view.height / zoom));
    const nx = (pt.x - view.x) / view.width;
    const ny = (pt.y - view.y) / view.height;
    const newX = pt.x - nx * newWidth;
    const newY = pt.y - ny * newHeight;
    setView({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100 text-slate-900">
      <div className="absolute inset-0">
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleCanvasClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePanStart}
          onPointerUpCapture={handlePanEnd}
          onWheel={handleWheel}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(15,23,42,0.15)" />
            </filter>
            <pattern id="grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0 H0 V50" fill="none" stroke="#cbd5e1" strokeWidth="0.75" />
              <circle cx="25" cy="25" r="1" fill="#cbd5e1" />
            </pattern>
          </defs>

          <rect x={view.x} y={view.y} width={view.width} height={view.height} fill="url(#grid)" />

          {builtPaths.map((path, idx) => (
            <g key={path.d + path.stroke + idx} filter="url(#shadow)">
              <path
                d={path.d || 'M0,0'}
                fill="none"
                stroke={path.stroke}
                strokeWidth={path.strokeWidth}
                strokeLinecap={path.lineCap}
                strokeLinejoin={path.lineJoin}
                opacity={project.pathInfo[idx]?.opacity ?? 1}
              />

              {path.stations.map((station) => {
                const size = 10;
                const offset = size / 2;
                const key = `${idx}-${station.id}`;
                const commonProps = {
                  key,
                  onPointerDown: handlePointerDown(project.pathInfo[idx].id, station.id)
                } as const;
                const isActive = selectedStation?.pathId === project.pathInfo[idx].id && selectedStation.stationIndex === station.id;
                if (station.stationStyle === 'circle') {
                  return (
                    <circle
                      {...commonProps}
                      cx={station.x}
                      cy={station.y}
                      r={offset}
                      fill={isActive ? '#eef2ff' : 'white'}
                      stroke={path.stroke}
                      strokeWidth={isActive ? 4 : 3}
                    />
                  );
                }
                return (
                  <rect
                    {...commonProps}
                    x={station.x - offset}
                    y={station.y - offset}
                    width={size}
                    height={size}
                    rx={2}
                    ry={2}
                    fill={isActive ? '#eef2ff' : 'white'}
                    stroke={path.stroke}
                    strokeWidth={isActive ? 4 : 3}
                  />
                );
              })}

              {path.labels.map((label) => (
                <text
                  key={`${idx}-${label.id}-label`}
                  x={label.x}
                  y={label.y}
                  textAnchor={label.textAnchor}
                  fontFamily="Anodina, sans-serif"
                  fontSize={14}
                  fill="#0f172a"
                  style={{ userSelect: 'none' }}
                >
                  <tspan x={label.x} dy="0">{label.primary}</tspan>
                  {label.secondary && (
                    <tspan x={label.x} dy="1.2em" fill="#475569" fontSize={12}>
                      {label.secondary}
                    </tspan>
                  )}
                </text>
              ))}
            </g>
          ))}

          {hover && (
            <rect
              x={hover.x - 5}
              y={hover.y - 5}
              width={10}
              height={10}
              rx={2}
              ry={2}
              fill="rgba(59,130,246,0.2)"
              stroke="#2563eb"
              strokeWidth={1.5}
              pointerEvents="none"
            />
          )}
        </svg>
        {tool === 'add' && (
          <div className="pointer-events-none absolute inset-0 border-4 border-dashed border-indigo-300/70" aria-hidden />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <span className="material-symbols-rounded text-xl text-indigo-500">train</span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">RailMapMaker</div>
              <div className="text-sm font-semibold text-slate-900">Canvas mode</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: selectedPath?.color ?? '#94a3b8' }} />
              <select
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={selectedPath?.id ?? ''}
                onChange={(e) => {
                  setSelectedPathId(Number(e.target.value));
                  setSelectedStation(null);
                }}
              >
                {project.pathInfo.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100" onClick={handleAddPath}>
              <span className="material-symbols-rounded text-sm">add</span>
              Add line
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm">
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 font-semibold ${tool === 'select' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
              onClick={() => setTool('select')}
            >
              <span className="material-symbols-rounded text-base">cursor</span>
              Select
            </button>
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 font-semibold ${tool === 'add' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
              onClick={() => setTool('add')}
            >
              <span className="material-symbols-rounded text-base">add_location_alt</span>
              Add
            </button>
            <button
              className={`flex items-center gap-1 rounded-full px-3 py-2 font-semibold ${tool === 'insert' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
              onClick={() => setTool('insert')}
            >
              <span className="material-symbols-rounded text-base">fork_right</span>
              Insert
            </button>
            {selectedStation && (
              <button
                className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-2 font-semibold text-rose-700"
                onClick={() => handleStationRemove(selectedStation.stationIndex)}
              >
                <span className="material-symbols-rounded text-base">delete</span>
                Delete selected
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={handleNew}>
              <span className="material-symbols-rounded text-base">add_circle</span>
              New
            </button>
            <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={handleDemo}>
              <span className="material-symbols-rounded text-base">auto_awesome</span>
              Demo
            </button>
            <label className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <span className="material-symbols-rounded text-base">upload_file</span>
              Import
              <input type="file" accept=".rmg,.json" className="hidden" onChange={(e) => handleImport(e.target.files?.[0] ?? null)} />
            </label>
            <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={handleExportSvg}>
              <span className="material-symbols-rounded text-base">image</span>
              SVG
            </button>
            <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={handleExportPng}>
              <span className="material-symbols-rounded text-base">photo_camera</span>
              PNG
            </button>
            <button className="flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500" onClick={handleExportRmg}>
              <span className="material-symbols-rounded text-base">file_save</span>
              RMG
            </button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center justify-between gap-3 p-4 text-xs text-slate-600">
          <div className="rounded-full bg-white/90 px-3 py-2 shadow-sm">
            {tool === 'add' && 'Add: click grid to append on active line.'}
            {tool === 'insert' && 'Insert: click nearest segment to drop a station between.'}
            {tool === 'select' && 'Select: click/drag stations. Middle/right drag or shift-drag to pan. Ctrl/Cmd+wheel to zoom.'}
          </div>
          <div className="rounded-full bg-white/90 px-3 py-2 shadow-sm">
            {project.width}×{project.height} • {project.pathInfo.length} lines • {stationCount} stations • Updated {new Date(project.lastModified).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
