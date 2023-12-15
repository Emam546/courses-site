import { TeacherComp } from "../lessons/assistants/info";
import Link from "next/link";
export type T = DataBase.WithIdType<DataBase["Lessons"]>;

export interface Props {
    teachers: {
        teacher: DataBase.WithIdType<DataBase["Teacher"]>;
        data: DataBase.WithIdType<DataBase["Levels"]>[];
    }[];
}
export default function LevelsInfoGetter({ teachers }: Props) {
    return (
        <>
            {teachers.length > 0 &&
                teachers.map(({ teacher, data }) => {
                    return (
                        <div key={teacher.id}>
                            <TeacherComp user={teacher} />
                            {data.map((level) => {
                                return (
                                    <div key={level.id}>
                                        <Link
                                            href={`/levels/info?id=${level.id}`}
                                            className="tw-text-base"
                                        >
                                            <>{level.name}</>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            {teachers.length == 0 && (
                <p className="tw-m-0">
                    There is no levels you have been added to
                </p>
            )}
        </>
    );
}
