import AddButton from "@/components/common/inputs/addButton";
import LevelsInfoGetter from "@/components/pages/levels/info";

export default function Levels() {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <div className="tw-flex-1">
                <LevelsInfoGetter />
            </div>
            <div className="py-3">
                <AddButton
                    label="Add Level"
                    href="/levels/add"
                />
            </div>
        </div>
    );
}
