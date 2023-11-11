import Link from "next/link";
import InfoGetter, {
    CreateElem,
    Props as InfoProps,
} from "../../../InsertCommonData";
import { Elem as OrgElem } from "../../../InsertCommonData/Elem";
import { DataBase, DataBase.WithIdType } from "@/data";

import draftToHtml from "draftjs-to-html";
export type QuestionType = DataBase.WithIdType<DataBase["Questions"]>;
const Elem = CreateElem<QuestionType>(
    ({ index, props: { data }, ...props }, ref) => {
        return (
            <OrgElem
                {...props}
                ref={ref}
            >
                <Link
                    className="tw-text-inherit hover:tw-text-inherit hover:tw-opacity-70"
                    href={`/questions?id=${data.id}`}
                >
                    <div className="tw-px-3">
                        <div>
                            <p className="tw-text-sm tw-text-end tw-m-0 tw-leading-3">
                                {data.createdAt.toDate().getTime()}
                            </p>
                        </div>
                        <div
                            className="question-text tw-mb-2"
                            dangerouslySetInnerHTML={{
                                __html: draftToHtml(JSON.parse(data.quest)),
                            }}
                        ></div>
                        <div>
                            {data.choices
                                .sort((a, b) => a.order - b.order)
                                .map(({ id, textContext }) => {
                                    return (
                                        <div
                                            key={id}
                                            className="question-choices tw-flex tw-items-center tw-gap-x-2 tw-mb-1"
                                        >
                                            <input
                                                type="radio"
                                                name={`quest-${data.id}`}
                                                value={id}
                                                disabled
                                                checked={data.answer == id}
                                            />
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: draftToHtml(
                                                        JSON.parse(textContext)
                                                    ),
                                                }}
                                            ></div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </Link>
            </OrgElem>
        );
    }
);
type QuestionInfoViewerProps = Omit<InfoProps<QuestionType>, "Elem">;
export default function QuestionInfoViewer(props: QuestionInfoViewerProps) {
    return (
        <>
            <InfoGetter
                Elem={Elem}
                {...props}
            />
        </>
    );
}
