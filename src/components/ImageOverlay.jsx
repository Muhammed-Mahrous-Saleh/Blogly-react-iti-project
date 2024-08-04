import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const ImageOverlay = ({ overlayImage, toggleImageOverlay }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [mouseDown, setMouseDown] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

    const handleToggleZoom = () => {
        if (isZoomed || mouseDown) {
            setIsZoomed(false);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            setIsZoomed(true);
            setScale(2);
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e) => {
        setMouseDown(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!mouseDown) return;

        const deltaX = e.clientX - lastMousePosition.x;
        const deltaY = e.clientY - lastMousePosition.y;

        setPosition((prevPosition) => ({
            x: prevPosition.x + deltaX / scale,
            y: prevPosition.y + deltaY / scale,
        }));

        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.min(Math.max(scale + delta, 1), 3);

        setScale(newScale);
        setIsZoomed(newScale > 1);

        if (newScale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            handleToggleZoom();
        }
    };

    useEffect(() => {
        // Prevent scrolling when overlay is active
        document.body.style.overflow = "hidden";

        // Add event listener for keydown
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup to allow scrolling again and remove event listener
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <img
                src={overlayImage}
                alt="Full view"
                className={`max-w-full max-h-full p-4 transition-transform duration-300 ease-in-out ${
                    isZoomed ? "cursor-grab" : "cursor-zoom-in"
                }`}
                style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    cursor: mouseDown
                        ? "grabbing"
                        : isZoomed
                        ? "grab"
                        : "zoom-in",
                }}
                onMouseDown={isZoomed ? handleMouseDown : null}
                onMouseUp={handleMouseUp}
                onClick={!isZoomed ? handleToggleZoom : null}
                draggable="false" // Prevents the default drag behavior
            />
            <button
                className="absolute top-5 right-5 text-white text-2xl"
                onClick={toggleImageOverlay}
            >
                &times;
            </button>
        </div>
    );
};

export default ImageOverlay;
