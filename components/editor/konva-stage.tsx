"use client";

import { useEffect, useMemo, useRef } from "react";
import { Ellipse, Layer, Rect, Stage, Text as KonvaText, Transformer } from "react-konva";
import type Konva from "konva";
import { CANVAS_DIMENSIONS } from "@/lib/constants";
import { type CanvasElement, useWorkspaceStore } from "@/store/workspaceStore";

const STAGE_SCALE = 1.6;
const STAGE_WIDTH = CANVAS_DIMENSIONS.width / STAGE_SCALE;
const STAGE_HEIGHT = CANVAS_DIMENSIONS.height / STAGE_SCALE;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getRectDragBounds(pos: { x: number; y: number }, w: number, h: number) {
  return { x: clamp(pos.x, 0, STAGE_WIDTH - w), y: clamp(pos.y, 0, STAGE_HEIGHT - h) };
}

function getTextDragBounds(pos: { x: number; y: number }, w: number, h: number) {
  return { x: clamp(pos.x, 0, STAGE_WIDTH - w), y: clamp(pos.y, 0, STAGE_HEIGHT - h) };
}

function getEllipseDragBounds(pos: { x: number; y: number }, w: number, h: number) {
  return { x: clamp(pos.x, w / 2, STAGE_WIDTH - w / 2), y: clamp(pos.y, h / 2, STAGE_HEIGHT - h / 2) };
}

function updateFromTransform(
  element: CanvasElement,
  node: Konva.Shape | Konva.Text,
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
) {
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  node.scaleX(1);
  node.scaleY(1);
  updateElement(element.id, {
    x: node.x() * STAGE_SCALE,
    y: node.y() * STAGE_SCALE,
    width: Math.max(48, node.width() * scaleX * STAGE_SCALE),
    height: Math.max(36, node.height() * scaleY * STAGE_SCALE),
  });
}

function updateEllipseFromTransform(
  element: CanvasElement,
  node: Konva.Ellipse,
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
) {
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  const nextWidth = Math.max(48, node.width() * scaleX * STAGE_SCALE);
  const nextHeight = Math.max(48, node.height() * scaleY * STAGE_SCALE);
  node.scaleX(1);
  node.scaleY(1);
  updateElement(element.id, {
    x: (node.x() - node.width() / 2) * STAGE_SCALE,
    y: (node.y() - node.height() / 2) * STAGE_SCALE,
    width: nextWidth,
    height: nextHeight,
  });
}

function getKonvaFontStyle(element: CanvasElement): string {
  const parts = [
    element.style.fontWeight === "bold" ? "bold" : "",
    element.style.fontStyle === "italic" ? "italic" : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : "normal";
}

export function KonvaStageWorkspace({ zoom = 1 }: { zoom?: number }) {
  const elements         = useWorkspaceStore((s) => s.elements);
  const selectedElementId = useWorkspaceStore((s) => s.selectedElementId);
  const selectElement    = useWorkspaceStore((s) => s.selectElement);
  const updateElement    = useWorkspaceStore((s) => s.updateElement);

  const orderedElements = useMemo(
    () => [...elements].sort((a, b) => a.layerOrder - b.layerOrder),
    [elements]
  );

  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRefs = useRef<Record<string, Konva.Shape | Konva.Text | null>>({});
  const editingRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (!selectedElementId) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }

    const selectedNode = nodeRefs.current[selectedElementId];
    if (selectedNode) {
      transformer.nodes([selectedNode]);
    } else {
      transformer.nodes([]);
    }
    transformer.getLayer()?.batchDraw();
  }, [selectedElementId, orderedElements]);

  return (
    <>
      <div className="canvas-instructions">
        <span>Drag enabled for unlocked elements.</span>
        <span>Click to select · Double-click text to edit · Delete key to remove</span>
      </div>

      <div className="konva-frame" style={{ width: STAGE_WIDTH * zoom, transition: "width 0.2s ease" }}>
        <Stage
          width={STAGE_WIDTH * zoom}
          height={STAGE_HEIGHT * zoom}
          scaleX={zoom}
          scaleY={zoom}
          className="konva-stage"
          onMouseDown={(event) => {
            if (event.target === event.target.getStage()) selectElement(null);
          }}
        >
          <Layer>
            <Rect
              x={0} y={0}
              width={STAGE_WIDTH}
              height={STAGE_HEIGHT}
              fill="#fffdf8"
              cornerRadius={20}
            />

            {orderedElements.map((element) => {
              const isSelected = element.id === selectedElementId;
              const elementWidth = element.width / STAGE_SCALE;
              const elementHeight = element.height / STAGE_SCALE;
              const commonProps = {
                rotation: element.rotation,
                draggable: !element.locked,
                visible: element.visible,
                opacity: element.style.opacity,
                onClick: () => selectElement(element.id),
                onTap: () => selectElement(element.id),
                onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
                  updateElement(element.id, {
                    x: event.target.x() * STAGE_SCALE,
                    y: event.target.y() * STAGE_SCALE,
                  });
                },
              };

              if (element.type === "rectangle") {
                return (
                  <Rect
                    key={element.id}
                    {...commonProps}
                    x={element.x / STAGE_SCALE}
                    y={element.y / STAGE_SCALE}
                    width={elementWidth}
                    height={elementHeight}
                    ref={(node) => { nodeRefs.current[element.id] = node; }}
                    fill={element.style.fill}
                    stroke={isSelected ? "#124b52" : element.style.stroke}
                    strokeWidth={isSelected ? 3 : element.style.strokeWidth}
                    cornerRadius={18}
                    shadowColor="rgba(31, 38, 35, 0.16)"
                    shadowBlur={18}
                    shadowOffset={{ x: 0, y: 10 }}
                    shadowOpacity={0.2}
                    dragBoundFunc={(pos) => getRectDragBounds(pos, elementWidth, elementHeight)}
                    onTransformEnd={(e) => updateFromTransform(element, e.target as Konva.Rect, updateElement)}
                  />
                );
              }

              if (element.type === "circle") {
                return (
                  <Ellipse
                    key={element.id}
                    {...commonProps}
                    x={element.x / STAGE_SCALE + elementWidth / 2}
                    y={element.y / STAGE_SCALE + elementHeight / 2}
                    ref={(node) => { nodeRefs.current[element.id] = node; }}
                    radiusX={elementWidth / 2}
                    radiusY={elementHeight / 2}
                    fill={element.style.fill}
                    stroke={isSelected ? "#a25715" : element.style.stroke}
                    strokeWidth={isSelected ? 3 : element.style.strokeWidth}
                    shadowColor="rgba(31, 38, 35, 0.12)"
                    shadowBlur={14}
                    shadowOffset={{ x: 0, y: 6 }}
                    shadowOpacity={0.18}
                    dragBoundFunc={(pos) => getEllipseDragBounds(pos, elementWidth, elementHeight)}
                    onDragEnd={(e) => {
                      updateElement(element.id, {
                        x: (e.target.x() - (e.target as Konva.Ellipse).width() / 2) * STAGE_SCALE,
                        y: (e.target.y() - (e.target as Konva.Ellipse).height() / 2) * STAGE_SCALE,
                      });
                    }}
                    onTransformEnd={(e) => updateEllipseFromTransform(element, e.target as Konva.Ellipse, updateElement)}
                  />
                );
              }

              // text
              const konvaFontStyle = getKonvaFontStyle(element);
              return (
                <KonvaText
                  key={element.id}
                  {...commonProps}
                  x={element.x / STAGE_SCALE}
                  y={element.y / STAGE_SCALE}
                  width={elementWidth}
                  height={elementHeight}
                  ref={(node) => { nodeRefs.current[element.id] = node; }}
                  text={element.text ?? "Text element"}
                  fill={element.style.fill}
                  fontSize={Math.max(10, element.style.fontSize / STAGE_SCALE)}
                  fontFamily={element.style.fontFamily ?? "Inter"}
                  fontStyle={konvaFontStyle}
                  align={element.style.textAlign ?? "left"}
                  padding={8}
                  dragBoundFunc={(pos) => getTextDragBounds(pos, elementWidth, elementHeight)}
                  onTransformEnd={(e) => updateFromTransform(element, e.target as Konva.Text, updateElement)}
                  onDblClick={() => {
                    const node = nodeRefs.current[element.id] as Konva.Text;
                    if (!node) return;

                    const stageBox = node.getStage()!.container().getBoundingClientRect();
                    const absPos = node.getAbsolutePosition();

                    const textarea = document.createElement("textarea");
                    editingRef.current = textarea;

                    textarea.value = element.text ?? "";
                    textarea.style.cssText = `
                      position: fixed;
                      top: ${stageBox.top + absPos.y * zoom + 8}px;
                      left: ${stageBox.left + absPos.x * zoom + 8}px;
                      width: ${(elementWidth - 16) * zoom}px;
                      min-height: ${(elementHeight - 16) * zoom}px;
                      font-size: ${Math.max(10, element.style.fontSize / STAGE_SCALE) * zoom}px;
                      font-family: ${element.style.fontFamily ?? "Inter"};
                      font-style: ${element.style.fontStyle ?? "normal"};
                      font-weight: ${element.style.fontWeight ?? "normal"};
                      text-align: ${element.style.textAlign ?? "left"};
                      color: ${element.style.fill};
                      background: rgba(255, 253, 248, 0.97);
                      border: 2px solid #0b6e66;
                      border-radius: 8px;
                      padding: 6px 8px;
                      resize: none;
                      outline: none;
                      z-index: 9999;
                      line-height: 1.5;
                      box-shadow: 0 4px 24px rgba(11,110,102,0.18);
                    `;

                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();

                    function finish() {
                      if (!editingRef.current) return;
                      const newText = textarea.value.trim() || "Text element";
                      updateElement(element.id, { text: newText });
                      editingRef.current = null;
                      textarea.remove();
                    }

                    textarea.addEventListener("blur", finish);
                    textarea.addEventListener("keydown", (e) => {
                      if (e.key === "Escape") finish();
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); finish(); }
                    });
                  }}
                />
              );
            })}

            <Transformer
              ref={transformerRef}
              rotateEnabled
              borderStroke="#1f6f78"
              borderStrokeWidth={2}
              anchorFill="#fff"
              anchorStroke="#1f6f78"
              anchorSize={10}
              anchorCornerRadius={3}
              rotateAnchorCursor="grab"
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 36 || newBox.height < 28) return oldBox;
                if (newBox.x < 0 || newBox.y < 0 || newBox.x + newBox.width > STAGE_WIDTH || newBox.y + newBox.height > STAGE_HEIGHT) return oldBox;
                return newBox;
              }}
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"]}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
