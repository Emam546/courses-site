import Link from "next/link";
import InfoGetter, {
    CreateElem,
    Props as InfoProps,
} from "../../../InsertCommonData";
import { Elem as OrgElem } from "../../../InsertCommonData/Elem";
import { DataBase, WithIdType } from "@/data";

import draftToHtml from "draftjs-to-html";
export type QuestionType = WithIdType<DataBase["Questions"]>;
const Elem = CreateElem<QuestionType>(
    ({ index, props: { data }, ...props }, ref) => {
        return (
            <OrgElem
                {...props}
                ref={ref}
            >
                <span className="tw-absolute tw-right-0 tw-top-0 tw-text-sm">
                    {data.createdAt.toDate().getTime()}
                </span>
                <Link
                    className="tw-text-inherit hover:tw-text-inherit hover:tw-opacity-70"
                    href={`/questions?id=${data.id}`}
                >
                    <div
                        className="question-text"
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
                                        className="question-choices tw-flex tw-items-center tw-gap-x-2"
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
