/**
 * When the robot wants attention it grabs the on-screen cursor and drags it over.
 * The real mouse cannot be moved, so this moves the site's own mustard cursor; the first real
 * movement of the mouse lets it go again.
 */
let pull: { x: number; y: number } | null = null;
export const setCursorPull = (p: { x: number; y: number } | null) => { pull = p; };
export const getCursorPull = () => pull;
