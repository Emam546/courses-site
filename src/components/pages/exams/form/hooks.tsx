import { auth, createCollection } from "@/firebase";
import {
    Query,
    getCountFromServer,
    getDoc,
    query,
    getDocs,
    limit,
    where,
    orderBy,
    DocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDocRef } from "@/firebase";
import { DataBase } from "@/data";
import { useAuthState } from "react-firebase-hooks/auth";
export function useCourseLevelData(
    lessonId: string
): [DocumentSnapshot<DataBase["Courses"]>[], boolean, any] {
    const [courses, setCourses] = useState<
        DocumentSnapshot<DataBase["Courses"]>[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<any>();
    const [teacher] = useAuthState(auth);
    useEffect(() => {
        async function getResult() {
            const lessonData = await getDoc(getDocRef("Lessons", lessonId));
            const courseData = await getDoc(
                getDocRef("Courses", lessonData.data()!.courseId)
            );
            const courses = await getDocs(
                query(
                    createCollection("Courses"),
                    where("levelId", "==", courseData.data()!.levelId),
                    orderBy("order")
                )
            );
            setCourses(courses.docs);
        }
        setLoading(true);
        getResult().catch((err) => setErr(err));
    }, []);

    return [courses, loading, err];
}
