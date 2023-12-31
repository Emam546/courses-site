import PrimaryButton from "@/components/button";
import { WrapElem } from "@/components/common/inputs/styles";
import { FieldError, useForm } from "react-hook-form";
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
import { validateDesc } from "../../lessons/form";
import { ErrorInputShower } from "@/components/common/inputs/main";
import { isRawDraftContentStateEmpty } from "@/utils/draftjs";
export type DataType = {
    quest: string;
    choices: Array<
        DataBase.WithOrder<
            DataBase.WithIdType<{
                textContext: string;
            }>
        >
    >;
    answer: string;
    shuffle: boolean;
};
export interface Props {
    onData: (data: DataType) => Promise<any> | any;
    defaultData?: DataType;
    buttonName: React.ReactNode;
    ResetAfterSubmit?: boolean;
    isCanNotEdit?: boolean;
}
export interface ChoiceProps {
    onSubmitQuestion: (quest: RawDraftContentState) => any;
    disabled?: boolean;
}
function ChoiceArea({ onSubmitQuestion, disabled }: ChoiceProps) {
    const { register, formState, handleSubmit, setValue, reset } = useForm<{
        area: RawDraftContentState;
    }>({});
    const [editorState, SetEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );
    register("area", {
        validate(val) {
            if (isRawDraftContentStateEmpty(val))
                return "You must fill the input first";
            return true;
        },
        required: "Please provide some content",
    });
    return (
        <div>
            <FinalEditor
                editorState={editorState}
                onEditorStateChange={SetEditorState}
                onContentStateChange={(val) => {
                    setValue("area", val);
                }}
                disabled={disabled}
            />
            <ErrorInputShower err={formState.errors.area as any} />
            <div className="tw-flex tw-justify-end tw-mt-3">
                <PrimaryButton
                    type="button"
                    disabled={formState.isSubmitting || disabled}
                    onClick={handleSubmit((data) => {
                        onSubmitQuestion(
                            convertToRaw(editorState.getCurrentContent())
                        );
                        const newEditorState = EditorState.push(
                            editorState,
                            ContentState.createFromText(""),
                            "remove-range"
                        );
                        SetEditorState(newEditorState);
                        reset();
                    })}
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
    isCanNotEdit,
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
        defaultValues: {
            choices: defaultData?.choices || [],
            answer: defaultData?.answer,
            quest: defaultData?.quest,
            shuffle: defaultData?.shuffle,
        },
    });
    const choices = watch("choices");
    const [questState, setQuestState] = useState(
        !defaultData
            ? EditorState.createEmpty()
            : EditorState.createWithContent(
                  convertFromRaw(JSON.parse(defaultData.quest))
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
    register("quest", {
        validate: validateDesc,
        required: "Please provide some content",
    });
    register("choices", {
        required: "Please add some choices",
        validate(val) {
            if (val.length <= 1)
                return "The number of choices must be larger than one";
            return true;
        },
    });
    return (
        <form
            onSubmit={handleSubmit(async (data, e) => {
                await onData({ ...data });
                if (ResetAfterSubmit) resetForm();
            })}
            autoComplete="off"
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
                    disabled={isCanNotEdit}
                />
                <ErrorInputShower err={formState.errors.quest} />
            </WrapElem>
            <div className="tw-mt-3">
                <CheckedInput
                    title="Shuffle Choices"
                    id="shuffle-input"
                    {...register("shuffle")}
                    disabled={isCanNotEdit}
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
                    disabled={isCanNotEdit}
                />
            </WrapElem>
            {choices.length > 0 && (
                <WrapElem
                    label="Choose The Answer"
                    className="tw-my-3"
                >
                    <ChoicesViewer
                        data={choices}
                        inputRef={register("answer", {
                            required: "Please provide an answer",
                            disabled: isCanNotEdit,
                        })}
                        onChange={(data) => setValue("choices", data)}
                    />
                </WrapElem>
            )}

            <ErrorInputShower err={formState.errors.answer} />
            <ErrorInputShower err={formState.errors.choices as FieldError} />
            <div className="tw-flex tw-justify-end">
                <PrimaryButton
                    type="submit"
                    disabled={formState.isSubmitting || isCanNotEdit}
                >
                    {buttonName}
                </PrimaryButton>
            </div>
        </form>
    );
}
