import Link from "next/link";
import React from "react";
export type ItemType = {
    id: string;
    link: string;
    num?: string;
    price?: DataBase["Courses"]["price"];
    desc: string;
    name: string;
    studentNum?: number;
};
export interface Props {
    items: ItemType[];
}
export default function MinShower({ items }: Props) {
    return (
        <div className="row course-items-area">
            {items.map((data, i) => {
                const studentState =
                    data.studentNum != undefined &&
                    (data.price == undefined || data.price.num > 0);

                return (
                    <div
                        key={data.id}
                        className="mix col-lg-3 col-md-4 col-sm-6"
                    >
                        <Link href={data.link}>
                            <div className="course-item">
                                <div
                                    className="course-thumb set-bg"
                                    style={{
                                        backgroundImage: `url(/img/courses/${
                                            (i % 6) + 1
                                        }.jpg)`,
                                    }}
                                >
                                    {data.price != undefined && (
                                        <div className="price">
                                            Price:{" "}
                                            {data.price.num > 0
                                                ? `${
                                                      data.price.num
                                                  }${data.price.currency.toUpperCase()}`
                                                : "Free"}
                                        </div>
                                    )}
                                </div>
                                <div className="course-info">
                                    <div className="course-text">
                                        <h5>{data.name}</h5>
                                        <p>{data.desc}</p>
                                        {studentState && (
                                            <div className="students">
                                                {data.studentNum} Students
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
