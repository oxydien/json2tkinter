import type App from "./interfaces/app";
import type EmptyWidget from "./interfaces/emptyWidget";
import type Widget from "./interfaces/widget";

// @ts-nocheck
export let app: App | null = null;
export let selectedWidget: Widget | null = null;
export let widgetCounter = 0;

function isApp(obj: unknown): obj is App {
  return (obj as App).content !== undefined;
}

export let setApp = (callback: (prev: App) => void) => {
  callback(app as App);
};
let setSelectedWidget = (_prev: Widget | null) => {
  console.warn("setSelectedWidget not defined");
}
export const setAppCallbacks = (lapp: App, lsetApp: (callback: (prev: App) => void) => void) => {
  setApp = lsetApp;
  app = lapp;
}
export const setSelectedWidgetCallback = (lselectedWidget: Widget | null, lsetSelectedWidget: ((prev: Widget | null) => void)) => {
  selectedWidget = lselectedWidget;
  // @ts-ignore
  setSelectedWidget = lsetSelectedWidget;
};

export const setWidgetCounter = (lwidgetCounter: number) => {
  widgetCounter = lwidgetCounter;
}

// MARK: Get maximum widget index
export const getMaximumWidgetIndex = (widgets: Widget[] = app?.content || []): number => {
  if (!widgets.length) return 0;
  return Math.max(
    ...widgets.map((widget: Widget) => 
      widget.content ? getMaximumWidgetIndex(widget.content) : widget.index
    )
  );
};

// MARK: Add widget
export const addWidget = (widgetType: { defaults: object; type: string; }) => {
  widgetCounter += 1;
  const doId = ["RadioButton", "CheckBox", "SelectMenu", "Input"].includes(widgetType.type);

  const newWidget = {
    ...widgetType.defaults,
    index: widgetCounter,
    id: doId ? `${widgetType.type.toLowerCase()}_${widgetCounter}` : undefined,
  };
  setApp((prev: App) => ({ ...prev, content: [...prev.content, newWidget] }));
};

// MARK: Remove widget
export const removeWidget = (widget: Widget) => {
  const parent = getParent(widget);
  if (!parent) return;
  setApp((prev: App) => {
    const updateContent = (content: Widget[]): Widget[] => {
      return content.map((item: Widget) => {
        if (item === widget) {
          return null;
        }
        if (item.content) {
          return { ...item, content: updateContent(item.content) };
        }
        return item;
      }).filter((item: Widget | null) => item !== null);
    };
    return { ...prev, content: updateContent(prev.content) };
  });

  if (widget === selectedWidget) {
    setSelectedWidget(null);
  }
};

// MARK: Update widget
export const updateWidget = (updates: EmptyWidget) => {
  if (!selectedWidget) return;
  console.debug("updateWidget: updates", updates);
  console.debug("updateWidget: selectedWidget", selectedWidget);
  setApp((prev: App) => {
    const newApp = { ...prev };
    const updateContent = (content: Widget[]): Widget[] => {
      return content.map((widget: Widget) => {
        if (widget.index === selectedWidget?.index) {
          return { ...widget, ...updates };
        }
        if (widget.content) {
          return { ...widget, content: updateContent(widget.content) };
        }
        return widget;
      });
    };
    newApp.content = updateContent(newApp.content);
    console.debug("updateWidget: newApp", newApp);
    return newApp;
  });
  // @ts-ignore
  setSelectedWidget((prev: Widget | null) => ({ ...prev, ...updates } as Widget));
};

// MARK: Get parent
export const getParent = (widget: Widget): Widget | App | null => {
  if (!app) return null;

  const findWidget = (current: Widget | App): Widget | App | null => {
    if (!current.content) return null;
    for (const item of current.content) {
      if (item.index === widget.index) {
        return current;
      }
      if (item.content) {
        const found = findWidget(item);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return findWidget(app);
};

// MARK: Get parent
export const getParentPath = (widget: Widget): number[] => {
  if (!app) return [];

  const parentPath: number[] = [];
  let current: Widget = widget;
  while (true) {
    const parent = getParent(current);
    if (!parent) {
      return [];
    }
    if (isApp(parent)) {
      break;
    }

    parentPath.unshift((parent?.content || []).indexOf(current));
    current = parent;
  }

  return parentPath;
};

// MARK: Get parent content
export const getParentContent = (parentPath: number[]): Widget[] => {
  if (!app) return [];

  let current: App | Widget = app;
  for (let i = 0; i < parentPath.length; i++) {
    if (!current.content) return [];

    current = current.content[parentPath[i]];
  }
  return current.content || [];
};

// MARK: Move widget
export const moveWidget = (widget: Widget, direction: string) => {
  const parent = getParent(widget);
  if (!parent || !parent.content) return;

  const currentIndex = parent.content.indexOf(widget);
  if (currentIndex === -1) return;

  // Check if movement is possible
  if (
    (direction === "up" && currentIndex === 0) ||
    (direction === "down" && currentIndex === parent.content.length - 1)
  ) {
    return;
  }

  setApp((prev: App) => {
    const updateContent = (content: Widget[]): Widget[] => {
      // If this is the parent content array containing our widget
      if (content === parent.content) {
        const newContent = [...content];
        const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        [newContent[currentIndex], newContent[swapIndex]] = 
        [newContent[swapIndex], newContent[currentIndex]];
        return newContent;
      }
      
      // Otherwise, recursively search and update nested content
      return content.map((item: Widget) => {
        if (item.content) {
          return { ...item, content: updateContent(item.content) };
        }
        return item;
      });
    };
    
    return { ...prev, content: updateContent(prev.content) };
  });
};

// MARK: Child widget
export const addChildToLayout = (layoutWidget: Widget, widgetType: { defaults: object; type: string; }) => {
  widgetCounter += 1;
  const doId = ["RadioButton", "CheckBox", "SelectMenu", "Input"].includes(widgetType.type);

  const newWidget = {
    ...widgetType.defaults,
    index: widgetCounter,
    id: doId ? `${widgetType.type.toLowerCase()}_${widgetCounter}` : undefined,
  };

  setApp((prev: App) => {
    const updateContent = (content: Widget[]): Widget[] => {
      return content.map((widget: Widget) => {
        if (widget === layoutWidget) {
          return {
            ...widget,
            content: [...(widget.content || []), newWidget],
          } as Widget;
        }
        if (widget.content) {
          return { ...widget, content: updateContent(widget.content) } as Widget;
        }
        return widget;
      });
    };
    return { ...prev, content: updateContent(prev.content) };
  });
};

// MARK: Get index path
export const getIndexPathOfWidget = (
  targetWidget: Widget,
): number[] | null => {
  if (!app) return null;
  const parentPath = getParentPath(targetWidget);

  return [...parentPath, targetWidget.index];
};
