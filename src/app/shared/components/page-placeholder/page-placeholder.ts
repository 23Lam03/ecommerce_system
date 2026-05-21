import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-placeholder',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <span class="text-5xl mb-4">🚧</span>
      <h2 class="text-xl font-bold text-slate-800">{{ title() }}</h2>
      <p class="text-sm text-slate-500 mt-2">Mã màn hình: <span class="font-mono text-indigo-600">{{ code() }}</span></p>
      <p class="text-slate-400 text-sm mt-4">Đang được phát triển — sẽ hoàn thiện ở bước tiếp theo.</p>
    </div>
  `,
})
export class PagePlaceholder {
  readonly title = input.required<string>();
  readonly code = input.required<string>();
}
