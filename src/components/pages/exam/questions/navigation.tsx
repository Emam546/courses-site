import { DataBase } from "@/data";
import { QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { useState } from "react";
import classNames from "classnames";
import DeleteDialog from "@/components/common/deleteDailog";

export function Navigation({
    result,
    selected,
    onSelect,
}: {
    result: QueryDocumentSnapshot<DataBase["Results"]>;
    selected: number;
    onSelect: (i: number) => any;
}) {
    const questions = result.data().questions;

    return (
            <ul className="tw-m-0 tw-flex tw-w-full tw-gap-1 tw-flex-wrap tw-p-0">
                {questions.map(({ state, answer }, index) => {
                    return (
                        <li
                            className={classNames(
                                " tw-cursor-pointer tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-rounded-3xl",
                                {
                                    "tw-bg-green-500 tw-text-gray-200": answer,
                                    "tw-bg-red-500 tw-text-gray-200":
                                        state == "visited" && !answer,
                                    "tw-bg-gray-200 tw-text-gray-600":
                                        state == "unvisited",
                                    "tw-bg-violet-500 tw-text-gray-200":
                                        state == "marked",
                                },
                                {
                                    "tw-border-[4px] tw-border-solid tw-border-blue-500":
                                        index == selected,
                                }
                            )}
                            key={index}
                            onClick={async () => {
                                if (selected == index) return;
                                onSelect(index);
                            }}
                        >
                            {index}
                        </li>
                    );
                })}
            </ul>
    );
}
