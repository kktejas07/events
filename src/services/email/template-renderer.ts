export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return variables[key] !== undefined ? variables[key] : `{{${key}}}`;
  });
}

export function renderSubject(subject: string, variables: Record<string, string>): string {
  return renderTemplate(subject, variables);
}
