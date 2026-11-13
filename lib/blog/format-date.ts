const formatter = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
  timeZone: 'Asia/Shanghai',
})

export function formatPostDate(iso: string): string {
  return formatter.format(new Date(iso))
}
