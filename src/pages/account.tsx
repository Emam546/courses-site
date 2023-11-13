import Head from "next/head";
import UploadAction, {
    DateType,
    Props as UploadProps,
} from "@/components/pages/account/uploadSection";
import EmailNotification from "@/components/pages/account/emailnotifications";
import DeleteAccount from "@/components/pages/account/deleteAccount";
import { useAppDispatch, useAppSelector } from "@/store";
import Link from "next/link";
import { AuthActions } from "@/store/auth";
import { ProviderUser } from "@/components/wrapper";
import { useGetLevels } from "@/hooks/firebase";
import { ErrorMessageCom } from "@/components/handelErrorMessage";
import Loader from "@/components/loader";
import { updateStudent } from "@/firebase/func/data/student";
const Page = ({ levels }: { levels: UploadProps["levels"] }) => {
    const user = useAppSelector((state) => state.auth.user!);
    const dispatch = useAppDispatch();

    return (
        <>
            <Head>
                <title>Account Settings</title>
            </Head>
            <ProviderUser>
                <div
                    className="page-info-section tw-pb-40"
                    style={{
                        backgroundImage: "url('img/page-bg/1.jpg')",
                    }}
                >
                    <div className="container">
                        <div className="site-breadcrumb">
                            <Link href="/">Home</Link>
                            <span>account</span>
                        </div>
                    </div>
                </div>
                <section className="search-section ss-other-page tw-pb-10">
                    <div className="container">
                        <div
                            className="search-warp tw-p-0"
                            style={{
                                padding: 0,
                            }}
                        >
                            <div className="section-title text-white">
                                <h2>
                                    <span>Account Settings</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="tw-bg-neutral-100 tw-pb-20 tw-pt-10">
                    <div className="tw-container tw-relative tw-px-3 tw-mx-auto py-20 ">
                        <UploadAction
                            levels={levels}
                            values={user}
                            onData={async (data: DateType) => {
                                await updateStudent(data);
                                dispatch(
                                    AuthActions.setUser({ ...user, ...data })
                                );
                            }}
                        />
                        <div className="tw-mt-16">
                            <EmailNotification />
                        </div>
                        <div className="tw-mt-16">
                            <DeleteAccount />
                        </div>
                    </div>
                </div>
            </ProviderUser>
        </>
    );
};
export default function SafeArea() {
    const {
        data: levels,
        isLoading,
        error,
    } = useGetLevels(process.env.NEXT_PUBLIC_TEACHER_ID as string);

    if (error) return <ErrorMessageCom error={error} />;
    if (isLoading) return <Loader />;
    return (
        <ProviderUser>
            <Page levels={levels} />
        </ProviderUser>
    );
}
