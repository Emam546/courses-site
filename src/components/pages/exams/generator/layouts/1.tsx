import classNames from "classnames";
import { PaperData } from "..";
import style from "./1.module.scss";
import { ExamPaper, QuestionPaper } from "../types";
import draftToHtml from "draftjs-to-html";
import { useEffect, useRef, useState } from "react";
import { Previewer } from "pagedjs";
import ReactDOMServer from "react-dom/server";
const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "g", "k"];
function Question({
    question,
    index,
    applyChoices,
}: {
    question: QuestionPaper;
    index: number;
    applyChoices?: boolean;
}) {
    return (
        <div
            className={classNames(
                "tw-pb-3 tw-mt-3 tw-border-0 tw-border-b tw-border-solid tw-border-black last:tw-border-b-0"
            )}
        >
            <div className="tw-break-inside-avoid">
                <div className="tw-flex tw-justify-between tw-mb-1">
                    <p className="">Q .{index + 1}</p>
                    <p className="tw-opacity-50">
                        {question.createdAt.toDate().getTime()}
                    </p>
                </div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: draftToHtml(JSON.parse(question.quest)),
                    }}
                    className="tw-mb-3"
                ></div>
            </div>
            {applyChoices && (
                <div className="tw-counter-reset">
                    {question.choices.map((choice, i) => {
                        return (
                            <div
                                key={choice.id}
                                className={classNames(
                                    "tw-counter-increment tw-flex tw-gap-2"
                                    // "before:tw-mt-1 before:tw-border-2 before:tw-w-3 before:tw-h-3 before:tw-border-solid before:tw-border-black  before:tw-rounded-[4px]"
                                )}
                            >
                                <p>{alpha[i]} .</p>
                                <div
                                    className="tw-flex-1"
                                    dangerouslySetInnerHTML={{
                                        __html: draftToHtml(
                                            JSON.parse(choice.textContext)
                                        ),
                                    }}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
interface ExamRenderProps {
    exam: ExamPaper;
    header: PaperData["header"];
    applyChoices?: boolean;
    topper?: PaperData["topper"];
    footer?: PaperData["footer"];
    dir?: "rtl" | "ltr";
}
function ExamRender({
    exam,
    header,
    topper,
    footer,
    applyChoices,
    dir,
}: ExamRenderProps) {
    return (
        <div
            className="set-margins"
            data-top-left={topper?.left}
            data-top-center={topper?.center}
            data-top-right={topper?.right}
            data-bottom-left={`Exam Id:${exam.id}`}
            data-bottom-center={footer?.center}
            data-bottom-right={footer?.right}
            dir={dir}
        >
            <div className="tw-break-inside-avoid tw-break-after-avoid">
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
                    <div className="tw-border-0 tw-border-l-2 rtl:tw-border-l-0 rtl:tw-border-r-2 tw-flex-shrink-0 tw-h-16 tw-aspect-square tw-self-stretch tw-border-solid"></div>
                </div>
                <div className="tw-font-semibold tw-flex tw-px-3 tw-py-2 tw-border-0 tw-border-y-2 tw-border-solid">
                    <div className="tw-space-y-1 tw-flex-1">
                        <p className="">
                            Student Name:{exam.student?.displayName}
                        </p>
                        <p className="">Student Id:{exam.student?.id}</p>
                    </div>
                    <div className="tw-space-y-1 tw-flex-1">
                        <p>Exam Id:{exam.id}</p>
                    </div>
                </div>
            </div>
            <div className="tw-px-4">
                {exam.questions.map((question, index) => {
                    return (
                        <Question
                            key={question.id}
                            question={question}
                            index={index}
                            applyChoices={applyChoices}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function Exam(props: ExamRenderProps) {
    const preview = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!preview.current) return;
        if (loading) return;
        setLoading(true);
        const string = ReactDOMServer.renderToString(<ExamRender {...props} />);
        const paged = new Previewer();
        preview.current.innerHTML = "";
        paged
            .preview(string, ["/style/printable.css"], preview.current)
            .finally(() => {
                setLoading(false);
            });
    }, [preview]);
    return <div ref={preview}></div>;
}
export default function ExamsWrapper({
    dir,
    footer,
    topper,
    header,
    applyChoices,
    exams,
}: {
    dir?: "rtl" | "ltr";
    applyChoices?: boolean;
    header: PaperData["header"];
    topper?: PaperData["topper"];
    footer?: PaperData["footer"];
    exams: ExamPaper[];
}) {
    useEffect(() => {
        document
            .querySelectorAll<HTMLDivElement>(".firebase-emulator-warning")
            .forEach((item) => {
                item.style.display = "none";
            });
    }, []);
    return (
        <div className={classNames(style.examLayout, "tw-w-full examLayout")}>
            <div>
                {exams.map((exam, index) => {
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <Exam
                            key={new Date().getTime() + index}
                            header={header}
                            exam={exam}
                            applyChoices={applyChoices}
                            footer={footer}
                            topper={topper}
                            dir={dir}
                        />
                    );
                })}
            </div>
        </div>
    );
}
