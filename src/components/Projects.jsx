import { useState, useEffect, useCallback, useRef } from "react";
import { PROJECTS } from "../constants/index";

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const RESET_VIEW = { scale: 1, x: 0, y: 0 };
const SWIPE_PX = 80; // how far a drag must go, in any direction, to change image
const DRAG_START_PX = 6; // movement before a press counts as a drag rather than a click

const Lightbox = ({ images, currentIndex, title, onClose }) => {
    const [index, setIndex] = useState(currentIndex);
    const [view, setView] = useState(RESET_VIEW); // zoom level and pan offset
    const [swipe, setSwipe] = useState({ x: 0, y: 0 }); // live offset while dragging between images
    const [dragging, setDragging] = useState(false);
    const [slide, setSlide] = useState(null); // 'next' | 'prev': direction the new picture fades in from
    const overlayRef = useRef(null);
    const imgRef = useRef(null);
    const viewRef = useRef(view);
    const indexRef = useRef(index);
    const drag = useRef(null); // { startX, startY, originX, originY, moved, mode }
    const justDragged = useRef(false);
    viewRef.current = view;
    indexRef.current = index;

    const last = images.length - 1;

    const go = useCallback((i, animate = true) => {
        const next = clamp(i, 0, last);
        setSlide(animate && next !== indexRef.current ? (next > indexRef.current ? "next" : "prev") : null);
        setIndex(next);
        setView(RESET_VIEW);
        setSwipe({ x: 0, y: 0 });
    }, [last]);

    // Lock page scrolling while the viewer is open (keep the scrollbar's width so nothing jumps).
    useEffect(() => {
        const { overflow, paddingRight } = document.body.style;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
        return () => {
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
        };
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") go(indexRef.current - 1);
            if (e.key === "ArrowRight") go(indexRef.current + 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, onClose]);

    // Mouse wheel zooms towards the cursor. Needs a non-passive listener so the page never scrolls.
    useEffect(() => {
        const el = overlayRef.current;
        if (!el) return undefined;
        const onWheel = (e) => {
            e.preventDefault();
            const img = imgRef.current;
            if (!img) return;
            const { scale, x, y } = viewRef.current;
            const next = clamp(scale * Math.exp(-e.deltaY * 0.0018), MIN_ZOOM, MAX_ZOOM);
            if (next === scale) return;
            if (next === MIN_ZOOM) {
                setView(RESET_VIEW);
                return;
            }
            // keep the point under the cursor fixed while the scale changes
            const rect = img.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - x; // image centre without the current pan
            const cy = rect.top + rect.height / 2 - y;
            const mx = e.clientX - cx;
            const my = e.clientY - cy;
            const k = next / scale;
            setView({ scale: next, x: mx - k * (mx - x), y: my - k * (my - y) });
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    const onPointerDown = (e) => {
        if (e.button !== 0 || e.target.closest("button")) return;
        drag.current = {
            startX: e.clientX, startY: e.clientY,
            originX: viewRef.current.x, originY: viewRef.current.y,
            moved: false,
            mode: viewRef.current.scale > 1 ? "pan" : "swipe",
        };
    };
    const onPointerMove = (e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (!d.moved) {
            if (Math.abs(dx) + Math.abs(dy) < DRAG_START_PX) return;
            d.moved = true;
            overlayRef.current?.setPointerCapture(e.pointerId);
            setDragging(true);
        }
        if (d.mode === "pan") {
            setView((v) => ({ ...v, x: d.originX + dx, y: d.originY + dy }));
        } else if (images.length > 1) {
            // the picture follows the pointer in any direction
            setSwipe({ x: dx, y: dy });
        }
    };
    // Left or up goes to the next image, right or down to the previous one, along whichever axis
    // the drag mostly went.
    const swipeStep = (dx, dy) => {
        const along = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
        return along < 0 ? 1 : -1;
    };
    const endDrag = (e) => {
        const d = drag.current;
        drag.current = null;
        if (!d?.moved) return;
        justDragged.current = true; // the click that follows a drag must not navigate or close
        setTimeout(() => { justDragged.current = false; }, 0);
        setDragging(false);
        if (d.mode === "swipe") {
            const dx = e.clientX - d.startX;
            const dy = e.clientY - d.startY;
            if (Math.hypot(dx, dy) > SWIPE_PX) go(index + swipeStep(dx, dy), false);
            setSwipe({ x: 0, y: 0 });
        }
    };

    // Blank area: left of the picture goes back, right of it goes forward, above or below closes.
    const onBlankClick = (e) => {
        if (justDragged.current) return;
        const rect = imgRef.current?.getBoundingClientRect();
        if (images.length < 2 || !rect) return onClose();
        if (e.clientX < rect.left) {
            if (index > 0) go(index - 1);
        } else if (e.clientX > rect.right) {
            if (index < last) go(index + 1);
        } else {
            onClose();
        }
    };

    const toggleZoom = () =>
        setView((v) => (v.scale > 1 ? RESET_VIEW : { scale: 2.5, x: 0, y: 0 }));

    // While dragging, the picture fades out and the one it will switch to fades in underneath.
    const dragDist = Math.hypot(swipe.x, swipe.y);
    const progress = clamp(dragDist / SWIPE_PX, 0, 1);
    const targetIndex = dragDist > 0 ? index + swipeStep(swipe.x, swipe.y) : index;
    const target = targetIndex !== index && targetIndex >= 0 && targetIndex <= last ? targetIndex : null;

    const arrow =
        "absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl leading-none shadow-lg ring-1 ring-white/30 transition-colors";

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden select-none"
            style={{ touchAction: "none" }}
            onClick={onBlankClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {images.length > 1 && index > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); go(index - 1); }}
                    className={`${arrow} left-4`}
                    aria-label="Previous image"
                >
                    ‹
                </button>
            )}
            {target !== null && (
                <img
                    src={images[target]}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 m-auto max-w-[calc(100%-2rem)] max-h-[85vh] rounded-lg shadow-2xl object-contain pointer-events-none"
                    style={{ opacity: progress, transform: `translateX(${(target > index ? 1 : -1) * (1 - progress) * 48}px)` }}
                />
            )}
            <img
                key={index}
                ref={imgRef}
                src={images[index]}
                alt={title}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={toggleZoom}
                className={`max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain ${slide ? (slide === "next" ? "lb-in-next" : "lb-in-prev") : ""}`}
                style={{
                    transform: `translate(${view.x + swipe.x}px, ${view.y + swipe.y}px) scale(${view.scale})`,
                    cursor: view.scale > 1 ? (dragging ? "grabbing" : "grab") : dragging ? "grabbing" : "zoom-in",
                    transition: dragging ? "none" : "transform 80ms ease-out",
                }}
            />
            {images.length > 1 && index < images.length - 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); go(index + 1); }}
                    className={`${arrow} right-4`}
                    aria-label="Next image"
                >
                    ›
                </button>
            )}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white/90 text-xs px-3 py-1.5 rounded-full pointer-events-none">
                {images.length > 1 && <span>{index + 1} / {images.length}</span>}
                {images.length > 1 && <span className="text-white/40">·</span>}
                <span className="text-white/70">
                    {view.scale > 1 ? `${view.scale.toFixed(1)}× · drag to move` : "scroll to zoom"}
                </span>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none z-10"
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
};

const ZoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 8a3 3 0 116 0A3 3 0 015 8z" />
        <path fillRule="evenodd" d="M8 14a6 6 0 100-12 6 6 0 000 12zm6.32-1.094l3.58 3.58a1 1 0 01-1.414 1.414l-3.58-3.58A8 8 0 1114.32 12.906z" clipRule="evenodd" />
    </svg>
);

const FeaturedCard = ({ project, onZoom }) => (
    <div className="rounded-xl border border-indigo-100 overflow-hidden mb-6 bg-white">
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
            {project.subtitle && (
                <span className="inline-block text-xs font-medium text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-4">
                    {project.subtitle}
                </span>
            )}
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-5">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
                {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex gap-2 flex-wrap">
                {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-gray-400 transition-colors">
                        GitHub
                    </a>
                )}
                {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                        Live Demo
                    </a>
                )}
            </div>
        </div>

        {project.screenshots?.length > 0 && (
            <div className="border-t border-gray-100 p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Screenshots</p>
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {project.screenshots.map((s, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 snap-start flex flex-col items-center group cursor-zoom-in"
                            onClick={() => onZoom(project.screenshots.map(x => x.src), i, project.title)}
                        >
                            <div className="relative overflow-hidden rounded-lg border border-gray-200 transition-shadow duration-300 group-hover:shadow-lg">
                                <img
                                    src={s.src}
                                    alt={s.label}
                                    className="h-64 w-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 text-gray-700 text-xs px-2.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                        <ZoomIcon />
                                        Zoom
                                    </span>
                                </div>
                            </div>
                            <p className="text-center text-[11px] text-gray-500 mt-2.5 font-medium leading-tight max-w-[180px]">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {project.architectureImg && (
            <div className="border-t border-gray-100">
                <div className="p-6 pb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Architecture</p>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {project.architectureDesc}
                    </p>
                </div>
                <div className="relative group cursor-zoom-in overflow-hidden" onClick={() => onZoom([project.architectureImg], 0, `${project.title} architecture diagram`)}>
                    <img
                        src={project.architectureImg}
                        alt={`${project.title} architecture diagram`}
                        className="w-full object-contain bg-gray-50 p-4 transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                        <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-2.5 py-1.5 rounded-full shadow-sm border border-gray-200/80">
                            <ZoomIcon />
                            Zoom
                        </span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

const ProjectCard = ({ project }) => (
    <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
        <div className="flex flex-col flex-1 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 whitespace-pre-line">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex gap-2 flex-wrap">
                {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-1.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-gray-400 transition-colors">
                        GitHub
                    </a>
                )}
                {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    </div>
);

const Projects = () => {
    const [lightbox, setLightbox] = useState(null);
    const handleClose = useCallback(() => setLightbox(null), []);
    const featured = PROJECTS.filter(p => p.featured);
    const rest = PROJECTS.filter(p => !p.featured);

    return (
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Projects</h2>
            {featured.map((p, i) => (
                <FeaturedCard key={i} project={p} onZoom={(images, currentIndex, title) => setLightbox({ images, currentIndex, title })} />
            ))}
            {rest.length > 0 && (
                <>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                        Other Projects
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rest.map((p, i) => <ProjectCard key={i} project={p} />)}
                    </div>
                </>
            )}
            {lightbox && (
                <Lightbox images={lightbox.images} currentIndex={lightbox.currentIndex} title={lightbox.title} onClose={handleClose} />
            )}
        </section>
    );
};

export default Projects;
