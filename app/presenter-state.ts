export const PRESENTER_CHANNEL = 'worawut-presentation-speaker-v1';
export type PresenterState = {
  index: number;
  total: number;
  title: string;
  note: string;
  nextTitle: string | null;
  photoId: number;
};
export function isPresenterState(value: unknown): value is PresenterState {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    Number.isInteger(s.index) &&
    Number.isInteger(s.total) &&
    (s.index as number) >= 0 &&
    (s.index as number) < (s.total as number) &&
    typeof s.title === 'string' &&
    typeof s.note === 'string' &&
    (s.nextTitle === null || typeof s.nextTitle === 'string') &&
    Number.isInteger(s.photoId)
  );
}
