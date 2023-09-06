import InfoGetter, { CreateElem } from "../../../InsertCommonData";
import { Elem as OrgElem } from "../../../InsertCommonData/Elem";
import { DataBase } from "@/data";
export type ChoiceType = DataBase["Questions"]["choices"][0];
import draftToHtml from "draftjs-to-html";
const Elem = CreateElem<{ choice: ChoiceType; answer?: string; id: string }>(
    (
        {
            index,
            props: {
                data: { choice: data, answer },
            },
            ...props
        },
        ref
    ) => {
        const draftData = draftToHtml(JSON.parse(data.textContext));
        const inputId = `answer${data.id}-input`;
        return (
            <OrgElem
                {...props}
                ref={ref}
            >
                <div className="question-choices tw-flex tw-items-center tw-gap-x-2">
                    <input
                        type="radio"
                        name="answer"
                        id={inputId}
                        value={data.id}
                        defaultChecked={answer == data.id}
                    />
                    <label
                        htmlFor={inputId}
                        className="tw-flex-1"
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: draftData }}
                        ></div>
                    </label>
                </div>
            </OrgElem>
        );
    }
);
export interface Props {
    data: ChoiceType[];
    answer?: string;
    onChange: (data: ChoiceType[]) => any;
}
export default function ChoicesViewer({ data, onChange, answer }: Props) {
    return (
        <>
            <InfoGetter
                Elem={Elem}
                data={data
                    .sort((a, b) => a.order - b.order)
                    .map((doc) => ({
                        id: doc.id,
                        choice: doc,
                        answer,
                    }))}
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
                            order: i,
                        }))
                    );
                }}
            />
        </>
    );
}
