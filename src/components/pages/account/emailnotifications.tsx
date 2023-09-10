import Divider from "@mui/material/Divider";
import Section from "./section";
import CheckBox from "./common/inputs/checkBox";
interface InputProps {
    start: string;
    end: string;
}
function CustomCheckBox({ start, end }: InputProps) {
    return (
        <div className="tw-flex tw-justify-between tw-items-center tw-gap-x-2">
            <div className="tw-flex-1">
                <h2 className="tw-font-semibold">{start}</h2>
                <p className="tw-text-neutral-40">{end}</p>
            </div>
            <div className="tw-flex-shrink-0 tw-text-sm">
                <CheckBox />
            </div>
        </div>
    );
}
export default function EmailNotification() {
    return (
        <Section label={"EMAIL NOTIFICATIONS"}>
            <CustomCheckBox
                start="Updates and Offers"
                end="New Courses and lessons Updates offers"
            />
            {/* <Divider className="my-6" />
            <CustomCheckBox
                start="Resume Analytics"
                end="Views, downloads and monthly statistics for each resume"
            />
            <Divider className="my-6" />
            <CustomCheckBox
                start="Resume and Job Tips Newsletter"
                end="Useful resume and job tips! Straight to your inbox every 2 weeks"
            />
            <Divider className="my-6" />
            <CustomCheckBox
                start="Career Plans"
                end="Get notified when career planning is available"
            /> */}
        </Section>
    );
}
