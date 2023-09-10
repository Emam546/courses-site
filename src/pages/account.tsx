import Head from "next/head";
import UploadAction, {
    DateType,
} from "@/components/pages/account/uploadSection";
import EmailNotification from "@/components/pages/account/emailnotifications";
import DeleteAccount from "@/components/pages/account/deleteAccount";
import { useAppSelector } from "@/store";
import Link from "next/link";
import { updateDoc } from "firebase/firestore";

const Page = () => {
    const user = useAppSelector((state) => state.auth.user!);
    return (
        <>
            <Head>
                <title>Account Settings</title>
            </Head>
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
                        values={user.data()}
                        onData={async (data: DateType) => {
                            await updateDoc(user.ref, {
                                ...data,
                            });
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
        </>
    );
};

export default Page;
