import { getDocCache, useDocument } from "@/hooks/fireStore";
import { NextPageWithLayout } from "../_app";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ErrorShower from "@/components/common/error";
import Page404 from "@/components/pages/404";
import ExamGeneratorInfoForm, {
    ExamPaperForm,
    PaperData,
    DataType as PaperDataType,
} from "@/components/pages/exams/generator";
import { CardTitle, MainCard } from "@/components/card";
import { formateDate } from "@/utils";
import { createExamQuestions } from "@func/server/utils/exam";
import { ExamPaper } from "@/components/pages/exams/generator/types";
import ExamsWrapper from "@/components/pages/exams/generator/layouts/1";
import { UserProvider } from "@/components/mainWrapper";
import { getDocs, query, where } from "firebase/firestore";
import { createCollection } from "@/firebase";
import Head from "next/head";
import PrimaryButton, { SuccessButton } from "@/components/button";
import ExamSolution from "@/components/pages/exams/generator/layouts/solution/1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
export interface Props {
    exam: DataBase.WithIdType<DataBase["Exams"]>;
    course: DataBase.WithIdType<DataBase["Courses"]>;
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
    level: DataBase.WithIdType<DataBase["Levels"]>;
}
export const createQuestions = async (
    exam: DataBase.WithIdType<DataBase["Exams"]>
) => {
    return (
        await Promise.all(
            createExamQuestions({
                ...exam,
            }).map(async (id) => {
                const doc = await getDocCache("Questions", id);
                if (!doc.exists()) return null;
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            })
        )
    ).filter(
        (val): val is DataBase.WithIdType<DataBase["Questions"]> => val != null
    );
};
const Page: NextPageWithLayout<Props> = ({ exam, course, lesson, level }) => {
    const [exams, setExams] = useState<ExamPaper[]>([]);
    const [paperProps, setPaperProps] = useState<PaperData>({
        header: {
            "0": exam.name,
            "1": course.name,
            "2": lesson.name,
            "3": level.name,
            "4": formateDate(new Date()),
            "5": "",
        },
        topper: {
            left: exam.name,
            right: course.name,
            center: level.name,
        },

        footer: { left: "", right: "", center: "" },
        dir: "ltr",
        applyChoices: true,
    });
    const [options, setOptions] = useState<PaperDataType>({
        examsNum: 3,
        forStudents: "Blank",
        random: true,
        num: Math.min(exam.questionIds.length, 20),
    });
    async function generateQuestions(data: PaperDataType) {
        let users: (DataBase.WithIdType<DataBase["Students"]> | null)[] = [];
        if (data.forStudents == "Blank")
            users = new Array(data.examsNum).fill(null);

        if (data.forStudents == "Course") {
            const enrollments = await getDocCache(
                "EnrolledUsersRecord",
                exam.courseId
            );
            if (!enrollments.exists())
                throw new Error("Undefined Enrollment Doc");
            users = (
                await Promise.all(
                    enrollments.data().payments.map(async ({ userId }) => {
                        const user = await getDocCache("Students", userId);
                        if (!user) return null;
                        return {
                            ...user.data(),
                            id: user.id,
                        };
                    })
                )
            ).filter(
                (val): val is DataBase.WithIdType<DataBase["Students"]> =>
                    val != null
            );
        }
        if (data.forStudents == "Level") {
            users = (
                await getDocs(
                    query(
                        createCollection("Students"),
                        where("levelId", "==", level.id)
                    )
                )
            ).docs.map((doc) => {
                return { ...doc.data(), id: doc.id };
            });
        }

        setExams(
            await Promise.all(
                users.map<Promise<ExamPaper>>(async (user, id) => {
                    const questions = data.random
                        ? createQuestions({
                              ...exam,
                              random: true,
                              num: data.num,
                          })
                        : createQuestions({
                              ...exam,
                              random: false,
                              shuffle: data.shuffle,
                          });
                    return {
                        questions: await questions,
                        id: id.toString(),
                        student: user
                            ? {
                                  displayName: user.displayname,
                                  id: user.id,
                              }
                            : undefined,
                    };
                })
            )
        );
    }
    return (
        <>
            <Head>
                <title>Generator :{exam.name}</title>
            </Head>
            <div className="tw-container tw-mx-auto tw-p-5 print:tw-hidden">
                <div>
                    <CardTitle>Paper Options</CardTitle>
                    <MainCard>
                        <ExamPaperForm
                            buttonName="Update"
                            onData={(data) => {
                                setPaperProps(data);
                                alert("Exam Updated");
                            }}
                            defaultData={paperProps}
                        />
                    </MainCard>
                    <CardTitle>Exam Options</CardTitle>
                    <MainCard>
                        <ExamGeneratorInfoForm
                            buttonName="Generate"
                            onData={async (data) => {
                                await generateQuestions(data);
                                setOptions(data);
                            }}
                            maxQuestionNumber={exam.questionIds.length}
                            defaultData={options}
                        />
                    </MainCard>
                    <div className="tw-flex tw-justify-end">
                        <SuccessButton
                            type="button"
                            onClick={() => {
                                print();
                            }}
                        >
                            <FontAwesomeIcon
                                className="tw-mr-1"
                                icon={faPrint}
                            />
                            Print
                        </SuccessButton>
                    </div>
                </div>
                {exams.length == 0 && options.forStudents == "Course" && (
                    <p>There is Students enrolled in this Course so far</p>
                )}
                {exams.length == 0 && options.forStudents == "Level" && (
                    <p>There is Students in this Level so far</p>
                )}
            </div>
            <div className="screen:tw-p-5 screen:tw-container screen:tw-mx-auto">
                <ExamsWrapper
                    dir={paperProps.dir}
                    topper={paperProps.topper}
                    footer={paperProps.footer}
                    exams={exams}
                    header={paperProps.header}
                    applyChoices={paperProps.applyChoices}
                />

                <ExamSolution
                    dir={paperProps.dir}
                    topper={paperProps.topper}
                    footer={paperProps.footer}
                    exams={exams}
                    header={paperProps.header}
                    applyChoices={paperProps.applyChoices}
                />
            </div>
        </>
    );
};
const SafeArea: NextPageWithLayout = function SafeArea() {
    const router = useRouter();
    const examId = router.query.examId as string;
    const [exam, loading, error] = useDocument("Exams", examId);
    const [lesson, loading2, error2] = useDocument(
        "Lessons",
        exam?.data()?.lessonId
    );
    const [course, loading3, error3] = useDocument(
        "Courses",
        exam?.data()?.courseId
    );
    const [level, loading4, error4] = useDocument(
        "Levels",
        course?.data()?.levelId
    );
    if (!examId) return <Page404 message="The ExamId is not exist" />;
    if (error || error2 || error3 || error4)
        return <ErrorShower error={error || error2 || error3 || error4} />;
    if (loading) return <ErrorShower loading />;
    if (!exam.exists()) return <Page404 message="The Exam is not exist" />;
    if (loading2) return <ErrorShower loading />;
    if (!lesson.exists()) return <Page404 message="The Lesson is not exist" />;
    if (loading3) return <ErrorShower loading />;
    if (!course.exists()) return <Page404 message="The Course is not exist" />;
    if (loading4) return <ErrorShower loading />;
    if (!level.exists()) return <Page404 message="The Level is not exist" />;
    return (
        <Page
            lesson={{ ...lesson.data(), id: lesson.id }}
            level={{ ...level.data(), id: level.id }}
            exam={{ ...exam.data(), id: exam.id }}
            course={{ ...course.data(), id: course.id }}
        />
    );
};
SafeArea.getLayout = (page) => {
    return <UserProvider>{page}</UserProvider>;
};
export default SafeArea;
