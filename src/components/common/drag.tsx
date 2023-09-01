import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { Dispatch, ReactNode, useEffect, useRef, useState } from "react";

export default function DraggableComp({
    onDragOver,
    onDrag,
    onDragStart,
    parentDiv,
}: {
    parentDiv?: HTMLElement | null;
    onDragOver?: (ele: Window) => any;
    onDrag?: (this: Window, ev: MouseEvent) => any;
    onDragStart?: (ele: Window) => any;
}) {
    const [drag, setDrag] = useState(false);
    const [cord, setCord] = useState<[number, number]>([0, 0]);
    const [parentWidth, setWidth] = useState<string>("");
    const [dragStart, setDragStart] = useState(false);

    useEffect(() => {
        if (drag) {
            if (onDrag) window.addEventListener("mousemove", onDrag);
            setDragStart(true);
            if (!dragStart && onDragStart) onDragStart(window);
        } else {
            if (dragStart && onDragOver) onDragOver(window);
            setDragStart(false);
            if (onDrag) window.removeEventListener("mousemove", onDrag);
        }
        return () => {
            if (onDrag) window.removeEventListener("mousemove", onDrag);
        };
    }, [drag]);
    useEffect(() => {
        if (!parentDiv) return;
        function DragOver() {
            setDrag(false);
            if (!parentDiv) return;
            parentDiv.style.width = parentWidth;
        }
        function elementDrag(e: MouseEvent) {
            if (!parentDiv) return;
            if (!drag) return;
            e.preventDefault();
            const [posX, posY] = cord;
            parentDiv.style.left = e.clientX - posX + "px";
            parentDiv.style.top = e.clientY - posY + "px";
        }
        window.addEventListener("mouseup", DragOver);
        window.addEventListener("mousemove", elementDrag);
        return () => {
            window.removeEventListener("mouseup", DragOver);
            window.removeEventListener("mousemove", elementDrag);
        };
    }, [parentDiv, drag, cord, parentWidth]);

    return (
        <div
            className={classNames("absolute -left-4", {
                "cursor-grab": !drag,
                "cursor-grabbing": drag,
            })}
            onMouseDown={(e) => {
                if (!parentDiv) return;
                e.preventDefault();
                const rect = parentDiv.getBoundingClientRect();
                const posX = e.clientX - rect.left;
                const posY = e.clientY - rect.top;
                parentDiv.style.left = e.clientX - posX + "px";
                parentDiv.style.top = e.clientY - posY + "px";
                setWidth(parentDiv.style.width);
                parentDiv.style.width = parentDiv.offsetWidth + "px";
                setCord([posX, posY]);
                setDrag(true);
            }}
        >
            <FontAwesomeIcon icon={faGripLinesVertical} />
        </div>
    );
}
