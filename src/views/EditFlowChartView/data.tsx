import { ToolBarPanelProps } from "@/components/ToolBarPanel";

export const defaultToolBarDisables: ToolBarPanelProps['isIconDisabled'] = 
[
    ["undo", false],
    ["redo", false],
    ["copy", false],
    ["paste", false],
    ["delete", false],
    ["zoomIn", true],
    ["zoomOut", true],
    ["resetZoom", true],
    ["autoFit", true],
    ["import", true],
    ["export", true],
];