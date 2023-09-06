import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import { WrapElem } from "@/components/common/inputs/styles";
import { DataBase } from "@/data";
import { useForm } from "react-hook-form";
import FinalEditor from "@/components/common/inputs/Editor";
import { useState } from "react";
import {
    EditorState,
    RawDraftContentState,
    ContentState,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import { uuid } from "@/utils";
import ChoicesViewer from "./choicesViewer";
import CheckedInput from "@/components/common/inputs/checked";
export type DataType = Omit<DataBase["Questions"], "lessonId" | "createdAt">;
export interface Props {
    onData: (data: DataType) => Promise<any> | any;
    defaultData?: DataType;
    buttonName: React.ReactNode;
    ResetAfterSubmit?: boolean;
}
export interface ChoiceProps {
    onSubmitQuestion: (quest: RawDraftContentState) => any;
}
function ChoiceArea({ onSubmitQuestion }: ChoiceProps) {
    const [editorState, SetEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );
    return (
        <div>
            <FinalEditor
                editorState={editorState}
                onEditorStateChange={SetEditorState}
            />
            <div className="tw-flex tw-justify-end tw-mt-3">
                <PrimaryButton
                    type="button"
                    onClick={() => {
                        const cond = editorState.getCurrentContent().hasText();
                        if (!cond)
                            return alert("please fill the choice area first");
                        onSubmitQuestion(
                            convertToRaw(editorState.getCurrentContent())
                        );
                        const newEditorState = EditorState.push(
                            editorState,
                            ContentState.createFromText(""),
                            "remove-range"
                        );
                        SetEditorState(newEditorState);
                    }}
                >
                    Add Choice
                </PrimaryButton>
            </div>
        </div>
    );
}
export default function QuestionGetDataForm({
    defaultData,
    onData,
    buttonName,
    ResetAfterSubmit,
}: Props) {
    const {
        register,
        handleSubmit,
        formState,
        getValues,
        watch,
        setValue,
        reset,
    } = useForm<DataType>({
        defaultValues: { choices: [], ...defaultData },
    });
    const choices = watch("choices");
    const [questState, setQuestState] = useState(
        !defaultData
            ? EditorState.createEmpty()
            : EditorState.createWithContent(
                  convertFromRaw(JSON.parse(defaultData?.quest))
              )
    );
    function resetForm() {
        const newContentState = ContentState.createFromText("");
        const newEditorState = EditorState.push(
            questState,
            newContentState,
            "remove-range"
        );
        setQuestState(newEditorState);
        reset();
    }
    return (
        <>
            <MainCard>
                <form
                    onSubmit={handleSubmit(async (data, e) => {
                        const formData = new FormData(e!.target);
                        const answer = formData.get("answer") as string;
                        if (questState.getCurrentContent().hasText())
                            return alert("please fill the question area first");
                        if (data.choices.length <= 1)
                            return alert("please add some choices first");
                        await onData({ ...data, answer });
                        if (ResetAfterSubmit) resetForm();
                    })}
                >
                    <WrapElem label="Question Area">
                        <FinalEditor
                            onContentStateChange={(content) =>
                                setValue("quest", JSON.stringify(content))
                            }
                            editorState={questState}
                            onEditorStateChange={(state) => {
                                setQuestState(state);
                            }}
                        />
                    </WrapElem>
                    <div className="tw-mt-3">
                        <CheckedInput
                            defaultChecked
                            title="Shuffle Choices"
                            id="shuffle-input"
                            {...register("shuffle")}
                        />
                    </div>
                    <WrapElem
                        label="Choices Area"
                        className="tw-my-3"
                    >
                        <ChoiceArea
                            onSubmitQuestion={(state) => {
                                setValue("choices", [
                                    ...getValues("choices"),
                                    {
                                        id: uuid(),
                                        textContext: JSON.stringify(state),
                                        order: getValues("choices").length,
                                    },
                                ]);
                            }}
                        />
                    </WrapElem>
                    {choices.length == 0 ? (
                        <p>Please Add Some choices</p>
                    ) : (
                        <WrapElem
                            label="Choose The Answer"
                            className="tw-my-3"
                        >
                            <ChoicesViewer
                                data={choices}
                                onChange={(data) => setValue("choices", data)}
                            />
                        </WrapElem>
                    )}

                    <div className="tw-flex tw-justify-end">
                        <PrimaryButton
                            type="submit"
                            disabled={formState.isSubmitting}
                        >
                            {buttonName}
                        </PrimaryButton>
                    </div>
                </form>
            </MainCard>
        </>
    );
}
