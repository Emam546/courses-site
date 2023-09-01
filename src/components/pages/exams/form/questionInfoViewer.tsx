import Link from "next/link";
import InfoGetter, { CreateElem } from "../../../InsertCommonData";
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
                <div>
                    <Link href={`/questions?id=${data.id}`}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: draftToHtml(JSON.parse(data.quest)),
                            }}
                        ></div>
                        {data.choices
                            .sort((a, b) => a.order - b.order)
                            .map(({ id, textContext }) => {
                                return (
                                    <div
                                        key={id}
                                        className="tw-flex tw-items-center"
                                    >
                                        <input
                                            type="text"
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
                    </Link>
                </div>
            </OrgElem>
        );
    }
);
interface QuestionInfoViewerProps {
    data: QuestionType[];
    onChange: (data: QuestionType[]) => any;
}
export default function QuestionInfoViewer({
    data,
    onChange,
}: QuestionInfoViewerProps) {
    return (
        <>
            <InfoGetter
                Elem={Elem}
                data={data}
                onDeleteElem={(v) => {
                    onChange(
                        data
                            .filter((cv) => cv.id != v.id)
                            .map((cv, i) => ({
                                ...cv,
                                order: i,
                            }))
                    );
                }}
                onResort={(indexes) => {
                    onChange(
                        indexes.map((ci, i) => ({
                            ...data[ci],
                        }))
                    );
                }}
            />
        </>
    );
}
