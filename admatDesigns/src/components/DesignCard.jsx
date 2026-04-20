import React from 'react'

const DesignCard = () => {

  return (
    <div>
        <section class="bg-white flex items-center justify-center px-4 py-16">
            <div class="flex flex-wrap items-stretch justify-center gap-5">
                <div class="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-2 flex flex-col w-46">
                    <div class="flex items-center justify-between mb-2">
                        <span class="bg-lime-300 text-neutral-800 text-xs px-2 py-0.5 rounded-full">
                            <span class="font-bold">
                                20%
                            </span> 
                            off
                        </span>
                        <div class="size-7 rounded-full border border-zinc-300 flex items-center justify-center cursor-pointer">
                            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.357.5c.303 0 .594.117.808.325s.335.491.335.786v8.334a.54.54 0 0 1-.076.277.584.584 0 0 1-.779.205L5.067 8.995a1.17 1.17 0 0 0-1.134 0l-2.578 1.432a.584.584 0 0 1-.779-.205.54.54 0 0 1-.076-.277V1.61c0-.295.12-.577.335-.786A1.16 1.16 0 0 1 1.643.5z" stroke="#27272a" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                    <div class="flex items-center justify-center h-30 mb-2">
                        <img src="https://assets.prebuiltui.com/images/components/card/card-lamp-image.png" alt="lamp" class="max-h-full max-w-full object-contain" />
                    </div>
                    <p class="text-sm text-neutral-500 mb-2 px-2">Cylindrical Modern Table Lamp</p>
                    <div class="flex items-center gap-2 px-2">
                        <span class="text-sm font-semibold text-neutral-800">$29.00</span>
                        <span class="text-xs text-neutral-500 line-through">$59.00</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default DesignCard