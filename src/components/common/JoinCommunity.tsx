import { useAppSelector } from "@/store";
import Link from "next/link";

export default function JoinCommunity() {
    const user = useAppSelector((state) => state.auth.user);
    if (user) return null;
    return (
        <>
            {/* banner section */}
            <section className="banner-section spad">
                <div className="container">
                    <div className="section-title mb-0 pb-2">
                        <h2>Join Our Community Now!</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Donec malesuada lorem maximus mauris
                            scelerisque, at rutrum nulla dictum. Ut ac ligula
                            sapien. Suspendisse cursus faucibus finibus.
                        </p>
                    </div>
                    <div className="text-center pt-5">
                        <Link
                            href="/sign-up"
                            className="site-btn"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </section>
            {/* banner section end */}
        </>
    );
}
