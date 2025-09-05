// In-memory storage for widgets (in production, use a database)
const widgets = new Map<string, any>();

export function saveWidget(id: string, data: any) {
  widgets.set(id, data);
}

export function getWidget(id: string) {
  return widgets.get(id);
}

export function generateWidgetId(location: string, movieTitle: string): string {
  const timestamp = Date.now().toString(36);
  const locationSlug = location.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const movieSlug = movieTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .substring(0, 20);
  return `${locationSlug}-${movieSlug}-${timestamp}`.replace(/--+/g, "-");
}
