import { PaperData } from "../..";
import { ExamPaper } from "../../types";
import { useEffect, useRef, useState } from "react";
import { Previewer } from "pagedjs";
import ReactDOMServer from "react-dom/server";
const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "g", "k"];
import style from "./1.module.scss";
import draftToHtml from "draftjs-to-html";
function Solution({
    exam,
    applyChoices,
}: {
    exam: ExamPaper;
    applyChoices?: boolean;
}) {
    return (
        <div className="tw-border tw-border-solid tw-break-inside-avoid">
            <div className="tw-flex tw-border-0 tw-border-b-2 tw-border-solid">
                <div className="tw-flex-1 tw-px-2 tw-py-2">
                    <p>ExamId :{exam.id}</p>
                    <p>Student Name:{exam.student?.displayName}</p>
                    <p>Student Id:{exam.student?.id}</p>
                </div>
                <div className="tw-flex-shrink-0 tw-w-10 tw-h-10 tw-border tw-border-l-2 rtl:tw-border-l rtl:tw-border-r-2 tw-border-solid tw-aspect-square"></div>
            </div>
            <div className="tw-flex tw-flex-wrap tw-gap-1 tw-gap-x-3 tw-font-semibold tw-px-2 tw-py-2">
                {exam.questions.map((quest, index) => {
                    if (!applyChoices) {
                        const answer = quest.choices.find(
                            (val) => val.id == quest.answer
                        );
                        return (
                            <div
                                className="tw-flex tw-gap-1"
                                key={index}
                            >
                                <p>{index + 1}.</p>
                                {answer != undefined && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: draftToHtml(
                                                JSON.parse(answer?.textContext)
                                            ),
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    }
                    const answer = quest.choices.findIndex(
                        (val) => val.id == quest.answer
                    );
                    return (
                        <p key={index}>
                            {index + 1} .{alpha[answer]}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}
interface ExamRenderProps {
    exams: ExamPaper[];
    topper?: PaperData["topper"];
    footer?: PaperData["footer"];
    header: PaperData["header"];
    dir?: "rtl" | "ltr";
    applyChoices?: boolean;
}
function SolutionRender({
    topper,
    footer,
    exams,
    header,
    dir,
    applyChoices,
}: ExamRenderProps) {
    return (
        <div
            data-top-left={topper?.left}
            data-top-center={topper?.center}
            data-top-right={topper?.right}
            data-bottom-left={footer?.left}
            data-bottom-center={footer?.center}
            data-bottom-right={footer?.right}
            dir={dir}
            className="set-margins"
        >
            <div className="tw-break-inside-avoid tw-break-after-avoid tw-border-0 tw-border-b-2 tw-border-solid">
                <div className="tw-flex tw-items-center tw-font-semibold">
                    <div className="tw-px-3 tw-flex-1 tw-py-2 tw-grid tw-grid-cols-3">
                        <div className="tw-text-start">
                            <p>{header[0]}</p>
                            <p>{header[1]}</p>
                        </div>
                        <div className="tw-w-fit tw-mx-auto">
                            <p>{header[2]}</p>
                            <p>{header[3]}</p>
                        </div>
                        <div className="tw-text-end">
                            <p>{header[4]}</p>
                            <p>{header[5]}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tw-grid tw-grid-cols-2">
                {exams.map((exam, index) => {
                    return (
                        <Solution
                            exam={exam}
                            applyChoices={applyChoices}
                            key={new Date().getTime() + index}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default function ExamSolution(props: ExamRenderProps) {
    useEffect(() => {
        document
            .querySelectorAll<HTMLDivElement>(".firebase-emulator-warning")
            .forEach((item) => {
                item.style.display = "none";
            });
    }, []);
    const preview = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!preview.current) return;
        if (loading) return;
        setLoading(true);
        const string = ReactDOMServer.renderToString(
            <SolutionRender {...props} />
        );
        const paged = new Previewer();
        preview.current.innerHTML = "";
        paged
            .preview(string, ["/style/printable.css"], preview.current)
            .finally(() => {
                setLoading(false);
            });
    }, [preview, props]);
    return (
        <div
            className={style.examSolution}
            ref={preview}
        ></div>
    );
}
