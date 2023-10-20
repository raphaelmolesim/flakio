import { PrimaryButton, Header } from './basic_elements.js'

export function MainContent() {
  return (
    <div class="pt-6 px-4">
      <article class="border p-6 bg-white rounded">
        <Header text='None report to show.' />
        <PrimaryButton text="Donwload newer data"></PrimaryButton>
      </article>
    </div>
  )
}