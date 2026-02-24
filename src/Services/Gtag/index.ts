export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;
  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

/**
 * Recommended events
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 * Recommended events are events that you implement, but that have predefined names and
 * parameters. Recommended events unlock existing and future reporting capabilities.
 */
export const tagRecommendedEvent = (event: string, parameter: Record<string, any>) => {
  if (!GA_TRACKING_ID) return;
  (window as any).gtag('event', event, parameter);
};

/**
 * Custom events
 * Custom events are events that you name. Only create a custom event if no event in the
 * other 3 categories (automatically collected events, enhanced measurement events, and
 * recommended events) will work for your use case. Custom events don't show up in most
 * standard reports. You need to set up custom reports for meaningful analysis.
 */
export const tagCustomEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: any;
}) => {
  if (!GA_TRACKING_ID) return;
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
