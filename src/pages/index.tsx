import { BigCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import UsersTable, {
    Props as UserTableProps,
} from "@/components/pages/users/info/table";
import { useRedirectIfNotCreator } from "@/components/wrappers/redirect";
import { auth, createCollection } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import {
    FirestoreError,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
export interface Props {
    users: UserTableProps["users"];
}
function Page({ users }: Props) {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <BigCard>
                <div>
                    {/*  Row 1 */}
                    <div className="row">
                        <div className="col-lg-8 d-flex align-items-strech">
                            <div className="card w-100">
                                <div className="card-body">
                                    <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                                        <div className="mb-3 mb-sm-0">
                                            <h5 className="card-title fw-semibold">
                                                Sales Overview
                                            </h5>
                                        </div>
                                        <div>
                                            <select className="form-select">
                                                <option value={1}>
                                                    March 2023
                                                </option>
                                                <option value={2}>
                                                    April 2023
                                                </option>
                                                <option value={3}>
                                                    May 2023
                                                </option>
                                                <option value={4}>
                                                    June 2023
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="chart" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    {/* Yearly Breakup */}
                                    <div className="card overflow-hidden">
                                        <div className="card-body p-4">
                                            <h5 className="card-title mb-9 fw-semibold">
                                                Yearly Breakup
                                            </h5>
                                            <div className="row align-items-center">
                                                <div className="col-8">
                                                    <h4 className="fw-semibold mb-3">
                                                        $36,358
                                                    </h4>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="me-1 rounded-circle bg-light-success round-20 d-flex align-items-center justify-content-center">
                                                            <i className="ti ti-arrow-up-left text-success" />
                                                        </span>
                                                        <p className="text-dark me-1 fs-3 mb-0">
                                                            +9%
                                                        </p>
                                                        <p className="fs-3 mb-0">
                                                            last year
                                                        </p>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-4">
                                                            <span className="round-8 bg-primary rounded-circle me-2 d-inline-block" />
                                                            <span className="fs-2">
                                                                2023
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="round-8 bg-light-primary rounded-circle me-2 d-inline-block" />
                                                            <span className="fs-2">
                                                                2023
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="d-flex justify-content-center">
                                                        <div id="breakup" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    {/* Monthly Earnings */}
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row alig n-items-start">
                                                <div className="col-8">
                                                    <h5 className="card-title mb-9 fw-semibold">
                                                        {" "}
                                                        Monthly Earnings{" "}
                                                    </h5>
                                                    <h4 className="fw-semibold mb-3">
                                                        $6,820
                                                    </h4>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <span className="me-2 rounded-circle bg-light-danger round-20 d-flex align-items-center justify-content-center">
                                                            <i className="ti ti-arrow-down-right text-danger" />
                                                        </span>
                                                        <p className="text-dark me-1 fs-3 mb-0">
                                                            +9%
                                                        </p>
                                                        <p className="fs-3 mb-0">
                                                            last year
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="d-flex justify-content-end">
                                                        <div className="text-white bg-secondary rounded-circle p-6 d-flex align-items-center justify-content-center">
                                                            <i className="ti ti-currency-dollar fs-6" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="earning" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 d-flex align-items-stretch">
                            <div className="card w-100">
                                <div className="card-body p-4">
                                    <div className="mb-4">
                                        <h5 className="card-title fw-semibold">
                                            Recent Transactions
                                        </h5>
                                    </div>
                                    <ul className="timeline-widget mb-0 position-relative mb-n5">
                                        <li className="timeline-item d-flex position-relative overflow-hidden">
                                            <div className="timeline-time text-dark flex-shrink-0 text-end">
                                                09:30
                                            </div>
                                            <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                                                <span className="timeline-badge border-2 border border-primary flex-shrink-0 my-8" />
                                                <span className="timeline-badge-border d-block flex-shrink-0" />
                                            </div>
                                            <div className="timeline-desc fs-3 text-dark mt-n1">
                                                Payment received from John Doe
                                                of $385.90
                                            </div>
                                        </li>
                                        <li className="timeline-item d-flex position-relative overflow-hidden">
                                            <div className="timeline-time text-dark flex-shrink-0 text-end">
                                                10:00 am
                                            </div>
                                            <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                                                <span className="timeline-badge border-2 border border-info flex-shrink-0 my-8" />
                                                <span className="timeline-badge-border d-block flex-shrink-0" />
                                            </div>
                                            <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                                                New sale recorded{" "}
                                                <a
                                                    href="javascript:void(0)"
                                                    className="text-primary d-block fw-normal"
                                                >
                                                    #ML-3467
                                                </a>
                                            </div>
                                        </li>
                                        <li className="timeline-item d-flex position-relative overflow-hidden">
                                            <div className="timeline-time text-dark flex-shrink-0 text-end">
                                                12:00 am
                                            </div>
                                            <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                                                <span className="timeline-badge border-2 border border-success flex-shrink-0 my-8" />
                                                <span className="timeline-badge-border d-block flex-shrink-0" />
                                            </div>
                                            <div className="timeline-desc fs-3 text-dark mt-n1">
                                                Payment was made of $64.95 to
                                                Michael
                                            </div>
                                        </li>
                                        <li className="timeline-item d-flex position-relative overflow-hidden">
                                            <div className="timeline-time text-dark flex-shrink-0 text-end">
                                                09:30 am
                                            </div>
                                            <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                                                <span className="timeline-badge border-2 border border-warning flex-shrink-0 my-8" />
                                                <span className="timeline-badge-border d-block flex-shrink-0" />
                                            </div>
                                            <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                                                New sale recorded{" "}
                                                <a
                                                    href="javascript:void(0)"
                                                    className="text-primary d-block fw-normal"
                                                >
                                                    #ML-3467
                                                </a>
                                            </div>
                                        </li>
                                        <li className="timeline-item d-flex position-relative overflow-hidden">
                                            <div className="timeline-time text-dark flex-shrink-0 text-end">
                                                09:30 am
                                            </div>
                                            <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                                                <span className="timeline-badge border-2 border border-danger flex-shrink-0 my-8" />
                                                <span className="timeline-badge-border d-block flex-shrink-0" />
                                            </div>
                                            <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                                                New arrival recorded
                                            </div>
                                        </li>
                                        <li className="timeline-item d-flex position-relative overflow-hidden">
                                            <div className="timeline-time text-dark flex-shrink-0 text-end">
                                                12:00 am
                                            </div>
                                            <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                                                <span className="timeline-badge border-2 border border-success flex-shrink-0 my-8" />
                                            </div>
                                            <div className="timeline-desc fs-3 text-dark mt-n1">
                                                Payment Done
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 d-flex align-items-stretch">
                            <div className="card w-100">
                                <div className="card-body p-4">
                                    <h5 className="card-title fw-semibold mb-4">
                                        Recent Students
                                    </h5>
                                    <UsersTable
                                        page={0}
                                        setPage={() => {}}
                                        totalUsers={users.length}
                                        users={users}
                                        headKeys={[
                                            "createdAt",
                                            "creatorId",
                                            "userName",
                                            "displayname",
                                            "levelId",
                                            "order",
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BigCard>
        </>
    );
}
function useGetLastStudents(teacherId?: string) {
    return useQuery<Props["users"], FirestoreError>({
        queryKey: ["Users", "lastStudents"],
        queryFn: async () => {
            const res = await getDocs(
                query(
                    createCollection("Students"),
                    where("teacherId", "==", teacherId),
                    orderBy("createdAt", "desc"),
                    limit(5)
                )
            );
            return res.docs.map((doc, i) => ({
                id: doc.id,
                order: i + 1,
                ...doc.data(),
            }));
        },
        enabled: typeof teacherId == "string",
    });
}
export default function SafeArea() {
    const [teacher] = useAuthState(auth);
    const router = useRouter();
    const teacherId = (router.query.teacherId as string) || teacher?.uid;
    const initUser = useGetLastStudents(teacherId);
    const redirecting = useRedirectIfNotCreator("/assistant");
    if (redirecting) return <ErrorShower loading />;
    if (initUser.error)
        return (
            <ErrorShower
                loading={false}
                error={initUser.error}
            />
        );
    if (initUser.isLoading) return <ErrorShower loading />;
    return <Page users={initUser.data} />;
}
