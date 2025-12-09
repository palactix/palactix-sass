/**
 * Replace placeholders in API URL templates with actual values
 * @param template - URL template with placeholders like {orgId}, {userId}, etc.
 * @param params - Object with key-value pairs to replace in template
 * @returns URL with replaced placeholders
 * 
 * @example
 * buildApiUrl("/organizations/{orgId}/staff/{userId}", { orgId: "123", userId: "456" })
 * // Returns: "/organizations/123/staff/456"
 */
export function buildApiUrl(
  template: string,
  params: Record<string, string | number>
): string {
  let url = template;
  
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, String(value));
  });
  
  return url;
}
