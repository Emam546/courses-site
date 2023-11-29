import { useState } from "react";
import { deleteDoc } from "firebase/firestore";
import ErrorShower from "../../../common/error";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Pagination from "@mui/material/Pagination";
import DeleteDialog from "@/components/common/AlertDialog";
import { clearResults, useGetResults, useGetResultsCount } from "./hooks";
import { formateDate, formateDateClock } from "@/utils";
import styles from "../../style.module.scss";
import Link from "next/link";
import { useGetDoc } from "@/hooks/fireStore";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const perPage = 30;
interface ElemProps {
    result: QueryDocumentSnapshot<DataBase["Results"]>;
}

function ResultShower({ result: result }: ElemProps) {
    const [open, setOpen] = useState(false);
    const { data: exam } = useGetDoc("Exams", result.data().examId);
    const data = result.data();
    return (
        <>
            <tr>
                <td>
                    <Link
                        href={`/exams?id=${exam?.id}`}
                        className=""
                    >
                        {exam?.data()?.name}
                    </Link>
                </td>
                <td>{data.questions.filter((q) => q.correctState).length}</td>
                <td>
                    {Math.floor(
                        (data.questions.filter((q) => q.correctState).length /
                            data.questions.length) *
                            100
                    )}%
                </td>
                <td>
                    {
                        data.questions.filter((q) => q.state == "unvisited")
                            .length
                    }
                </td>
                <td>
                    {
                        data.questions.filter(
                            (q) => q.state != "unvisited" && !q.correctState
                        ).length
                    }
                </td>
                <td>{data.questions.length}</td>
                <td>
                    {formateDate(data.startAt.toDate())}
                    {"_"}
                    {formateDateClock(data.startAt.toDate())}
                </td>
                <td>
                    {data.endAt
                        ? formateDateClock(data.endAt.toDate())
                        : "Auto Closed"}
                </td>
                <td>
                    <Link href={`/exams/take?id=${result.id}`}>Show</Link>
                </td>
                <td>
                    <button
                        type="button"
                        className="hover:tw-text-red-600 disabled:tw-text-neutral-600 tw-border-0 tw-bg-transparent tw-block tw-w-fit tw-mx-auto"
                        onClick={() => {
                            setOpen(true);
                        }}
                        aria-label="delete"
                        disabled={open}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </td>
            </tr>
            <DeleteDialog
                onAccept={async () => {
                    clearResults(result.data().userId);
                    await deleteDoc(result.ref);
                    setOpen(false);
                }}
                onClose={function () {
                    setOpen(false);
                }}
                open={open}
                data={{
                    title: `Delete Exam Result`,
                    desc: `Once you click Delete, The result will be Deleted`,
                    accept: `Delete`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
export interface Props {
    userId: string;
}
export default function UserResultGenerator({ userId }: Props) {
    const [page, setPage] = useState(0);
    const queryCount = useGetResultsCount({
        userId,
    });
    const queryResults = useGetResults({
        userId,
        page: page,
    });
    const results = queryResults.data;
    const count = queryCount.data;
    return (
        <>
            <ErrorShower
                loading={false}
                error={queryCount.error || queryResults.error}
            />
            {results && count != undefined && (
                <div>
                    {count > 0 && (
                        <>
                            <table
                                className={styles.table}
                                border={1}
                            >
                                <thead>
                                    <tr>
                                        <th>Exam</th>
                                        <th>Score</th>
                                        <th>Percent</th>
                                        <th>UnVisited</th>
                                        <th>Wrong</th>
                                        <th>Total Questions</th>
                                        <th>Start At</th>
                                        <th>End At</th>
                                        <th>Show</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((doc) => {
                                        return (
                                            <ResultShower
                                                result={doc}
                                                key={doc.id}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="tw-mt-5">
                                <Pagination
                                    onChange={(e, value) => {
                                        setPage(value);
                                    }}
                                    page={page}
                                    count={Math.floor(
                                        queryCount.data / perPage
                                    )}
                                />
                            </div>
                        </>
                    )}
                    {count == 0 && <p className="tw-mb-0">There is no results so far</p>}
                </div>
            )}
        </>
    );
}
