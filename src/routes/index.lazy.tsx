// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-alert */
import { JSX, useCallback, useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { initCloudStorage } from "@tma.js/sdk-react";
import * as dateFns from "date-fns";

import styles from "./index.module.scss";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index(): JSX.Element {
  const cloudStorage = initCloudStorage();
  const LAST_USE_DATE_KEY = "last-use-date";
  const USING_COUNT_KEY = "using-count";
  const [lastUseDate, setLastUseDate] = useState<Date | undefined>();
  const [usingCount, setUsingCount] = useState<number | undefined>();

  const handleIncreaseUse = useCallback(async () => {
    const confirm = window.confirm("Are you sure you want to increase use?");
    if (!confirm) return;

    const _usingCount = usingCount ? usingCount + 1 : 1;

    await cloudStorage.set(USING_COUNT_KEY, _usingCount.toString());
    await cloudStorage.set(LAST_USE_DATE_KEY, new Date().toISOString());

    setUsingCount(_usingCount);
    setLastUseDate(new Date());
  }, [cloudStorage, usingCount]);

  const handleDecreaseUse = useCallback(async () => {
    const confirm = window.confirm("Are you sure you want to decrease use?");
    if (!confirm) return;

    const _usingCount = usingCount ? usingCount - 1 : 0;

    await cloudStorage.set(USING_COUNT_KEY, _usingCount.toString());
    await cloudStorage.set(LAST_USE_DATE_KEY, new Date().toISOString());

    setUsingCount(_usingCount);
    setLastUseDate(new Date());
  }, [cloudStorage, usingCount]);

  const reload = useCallback(async () => {
    const _lastUseDate = await cloudStorage.get(LAST_USE_DATE_KEY);
    const _usingCount = await cloudStorage.get(USING_COUNT_KEY);

    console.log("Initial last use date:", _lastUseDate);
    console.log("Initial using count:", _usingCount);

    setLastUseDate(_lastUseDate ? new Date(_lastUseDate) : undefined);
    setUsingCount(_usingCount ? Number(_usingCount) : undefined);
  }, [cloudStorage]);

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className={styles.page}>
      <p>
        <div className={styles.date}>
          Updated{" "}
          {lastUseDate
            ? dateFns.formatDistanceToNow(lastUseDate, {
                addSuffix: true,
                includeSeconds: true,
              })
            : "N/A"}
        </div>
        <br />
        <div className={styles.count}>Using count: {usingCount}</div>
      </p>
      <hr />
      <button onClick={handleIncreaseUse}>Increase use</button>
      <br />
      <button onClick={handleDecreaseUse}>Decrease use</button>
      <br />
      <br />
      <button onClick={reload}>Reload</button>
    </div>
  );
}
