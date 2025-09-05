"use client";

import { useCallback, useEffect, useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://admin.jiyrma-gt.kz";

export default function useQuestions({ subjectSetId, lang = "ru" }) {
  const [data, setData] = useState([]); // [{id,title,type,subject_type,questions:[...]}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `${BASE_URL}/api/v1/exam/questions/?subject_set=${subjectSetId}&lang=${lang}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [subjectSetId, lang]);

  useEffect(() => {
    if (subjectSetId) fetchData();
  }, [fetchData, subjectSetId]);

  return { data, loading, error, refetch: fetchData };
}
