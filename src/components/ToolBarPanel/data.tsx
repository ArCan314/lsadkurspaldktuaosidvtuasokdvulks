import { IconDefinition, faCopy, faFileExport, faFileImport, faMagnifyingGlass, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faMaximize, faPaste, faRotateLeft, faRotateRight, faTrash } from "@fortawesome/free-solid-svg-icons";

export type ToolBarIconType = 'undo' | 'redo' | 'copy' | 'paste' | 
                              'delete' | 'zoomIn' | 'zoomOut' | 'resetZoom' | 
                              'autoFit' | 'export' | 'import' | 'unitList';

export interface ToolBarItem {
    title: string;
    type: ToolBarIconType;
    icon: IconDefinition;
};

export const toolBarData: ToolBarItem[][] = [
    [
        {
            title: "撤销",
            type: "undo",
            icon: faRotateLeft,
        },
        {
            title: "重做",
            type: "redo",
            icon: faRotateRight,
        }
    ],
    [
        {
            title: "复制",
            type: "copy",
            icon: faCopy,
        },
        {
            title: "粘贴",
            type: "paste",
            icon: faPaste,
        },
        {
            title: "删除",
            type: "delete",
            icon: faTrash,
        }
    ],
    [
        {
            title: "放大",
            type: "zoomIn",
            icon: faMagnifyingGlassPlus,
        },
        {
            title: "缩小",
            type: "zoomOut",
            icon: faMagnifyingGlassMinus,
        },
        {
            title: "实际大小",
            type: "resetZoom",
            icon: faMagnifyingGlass,
        },
        {
            title: "适合画布",
            type: "autoFit",
            icon: faMaximize,
        },
    ],
    [
        {
            title: "导出",
            type: "export",
            icon: faFileExport,
        },
        {
            title: "导入",
            type: "import",
            icon: faFileImport,
        },
    ]

];