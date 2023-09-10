import { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";
import InfoGetter, { CreateElem } from "../../../InsertCommonData";
import { Elem as OrgElem } from "../../../InsertCommonData/Elem";
import { DataBase } from "@/data";
export type ChoiceType = DataBase["Questions"]["choices"][0];
import draftToHtml from "draftjs-to-html";
const Elem = CreateElem<{
    choice: ChoiceType;
    id: string;
    props: UseFormRegisterReturn<"answer">;
}>(
    (
        {
            index,
            props: {
                data: { choice: data, props: inputProps },
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
                        id={inputId}
                        value={data.id}
                        {...inputProps}
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
    onChange: (data: ChoiceType[]) => any;
    inputRef: UseFormRegisterReturn<"answer">;
}
export default function ChoicesViewer({
    data,
    onChange,
    inputRef,
}: Props) {
    return (
        <>
            <InfoGetter
                Elem={Elem}
                data={data
                    .sort((a, b) => a.order - b.order)
                    .map((doc) => ({
                        id: doc.id,
                        choice: doc,
                        props: inputRef,
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
