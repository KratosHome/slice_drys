'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/utils/cn'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between rounded-[0.125rem] py-4 text-left text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180',
        'bg-black p-6 text-base font-semibold text-white sm:text-xl md:text-2xl',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div
      className={cn(
        'pb-4 pt-0',
        'flex flex-col gap-6 border-4 border-t-0 border-dashed px-6 py-8 text-base sm:flex-row sm:flex-wrap md:text-xl',
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg
    width="26"
    height="20"
    viewBox="0 0 26 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M25.2431 1.48603H25.4951C25.4711 1.58203 25.4471 1.67803 25.423 1.77403C25.423 1.87003 25.3991 1.96603 25.3511 2.06203V2.09803C25.3271 2.09803 25.3151 2.11003 25.3151 2.13403L25.5311 2.63803L25.819 3.25003V3.28603L25.9631 3.86203C25.9871 3.88603 25.9991 3.91003 25.9991 3.93403C25.9991 4.00603 25.9511 4.06603 25.8551 4.11403C25.7831 4.11403 25.7471 4.15003 25.7471 4.22203C25.7711 4.31803 25.7471 4.39003 25.6751 4.43803C25.555 4.43803 25.4831 4.40203 25.4591 4.33003L25.0631 3.14203L24.9191 2.74603C24.871 2.84203 24.8111 2.93803 24.739 3.03403L24.8831 3.50203L25.0991 4.04203L25.3151 4.61803C25.3391 4.71403 25.3031 4.78603 25.2071 4.83403C25.111 4.88203 25.0391 4.84603 24.9911 4.72603L24.7751 4.18603L24.5951 3.61003L24.5231 3.39403C24.4991 3.44203 24.475 3.49003 24.451 3.53803C24.427 3.56203 24.4031 3.59803 24.3791 3.64603L24.5231 4.11403L24.7031 4.69003L24.9911 5.30203C25.0391 5.39803 25.0151 5.47003 24.9191 5.51803C24.823 5.54203 24.7511 5.51803 24.7031 5.44603L24.4151 4.83403V4.79803L24.1991 4.22203L24.1271 4.00603C24.0791 4.10203 24.0311 4.17403 23.9831 4.22203L24.2711 4.72603L24.5231 5.23003L24.7751 5.77003C24.8231 5.86603 24.7991 5.93803 24.7031 5.98603C24.607 6.03403 24.5351 6.01003 24.4871 5.91403L24.2351 5.37403L23.9831 4.87003L23.8031 4.54603L23.5871 4.87003L23.7671 5.37403L23.9831 5.95003L24.1271 6.45403C24.1511 6.55003 24.1151 6.62203 24.0191 6.67003C23.923 6.67003 23.8631 6.63403 23.8391 6.56203L23.659 6.02203L23.4431 5.48203L23.371 5.19403C23.323 5.24203 23.2751 5.31403 23.2271 5.41003L23.4431 5.87803L23.6951 6.45403V6.49003L23.8391 7.06603C23.8631 7.16203 23.8271 7.23403 23.7311 7.28203C23.635 7.28203 23.5751 7.24603 23.5511 7.17403L23.3711 6.56203L23.1551 5.98603L23.0111 5.73403C22.9871 5.75803 22.9631 5.79403 22.9391 5.84203C22.9151 5.86603 22.8911 5.90203 22.8671 5.95003L23.0111 6.41803L23.1911 6.99403L23.4071 7.53403C23.4311 7.63003 23.3951 7.70203 23.2991 7.75003C23.2031 7.79803 23.1311 7.76203 23.0831 7.64203L22.8671 7.10203V7.06603L22.7231 6.52603L22.6151 6.31003V6.34603H22.5791C22.555 6.37003 22.5431 6.39403 22.5431 6.41803C22.5191 6.44203 22.4951 6.47803 22.4711 6.52603L22.6871 6.99403H22.7231L22.9031 7.57003L23.1191 8.11003C23.1431 8.20603 23.1071 8.27803 23.0111 8.32603C22.9151 8.37403 22.8431 8.33803 22.7951 8.21803L22.6151 7.67803L22.3991 7.10203L22.2191 6.77803C22.1711 6.87403 22.1351 6.95803 22.1111 7.03003V7.06603L22.291 7.57003L22.5071 8.11003L22.7591 8.75803C22.7831 8.85403 22.7471 8.92603 22.6511 8.97403C22.5791 9.02203 22.5191 8.98603 22.4711 8.86603L22.2191 8.25403L21.9671 7.67803L21.8591 7.35403C21.8111 7.40203 21.7751 7.45003 21.7511 7.49803C21.7271 7.54603 21.7031 7.59403 21.6791 7.64203L21.8231 8.21803L22.0391 8.72203V8.75803L22.1831 9.33403C22.2071 9.43003 22.1711 9.50203 22.0751 9.55003C21.955 9.55003 21.8951 9.51403 21.8951 9.44203L21.7151 8.83003L21.4991 8.32603L21.4271 8.07403C21.4031 8.14603 21.3431 8.25403 21.2471 8.39803L21.3911 8.90203L21.6791 9.40603V9.44203L21.8231 10.018C21.8471 10.114 21.8111 10.186 21.7151 10.234C21.6191 10.234 21.5591 10.198 21.5351 10.126L21.3551 9.55003L21.1031 9.04603V9.01003H21.0671L21.0311 8.79403C21.0071 8.81803 20.9951 8.84203 20.9951 8.86603C20.9951 8.86603 20.9831 8.87803 20.9591 8.90203L21.1751 9.40603L21.3911 10.018L21.5711 10.63C21.5711 10.75 21.5231 10.822 21.4271 10.846C21.3311 10.846 21.2711 10.81 21.2471 10.738L21.0671 10.09L20.8871 9.51403L20.7791 9.26203C20.7311 9.31003 20.6951 9.35803 20.6711 9.40603C20.6471 9.45403 20.6231 9.50203 20.5991 9.55003L20.7071 9.87403L20.9591 10.378L21.2111 11.026C21.2351 11.122 21.1991 11.194 21.1031 11.242C21.007 11.29 20.9351 11.254 20.8871 11.134L20.6711 10.522L20.4191 10.018V9.98203L20.3831 9.87403C20.3591 9.89803 20.3351 9.93403 20.3111 9.98203C20.2871 10.006 20.2631 10.042 20.239 10.09L20.3831 10.414L20.5631 10.954L20.8151 11.494C20.8631 11.59 20.8391 11.662 20.7431 11.71C20.6471 11.758 20.5751 11.734 20.5271 11.638L20.2751 11.098L20.0231 10.378C19.975 10.402 19.9391 10.438 19.9151 10.486C19.8671 10.534 19.8311 10.582 19.8071 10.63L19.7711 10.666L19.9151 11.026L20.0951 11.566L20.239 12.106C20.2631 12.202 20.2271 12.274 20.1311 12.322C20.0111 12.322 19.951 12.286 19.951 12.214L19.7711 11.638L19.5911 11.134L19.5191 10.918C19.4711 10.942 19.4351 10.978 19.4111 11.026C19.3871 11.05 19.3631 11.086 19.3391 11.134L19.4831 11.674L19.7351 12.178L19.9511 12.79C19.9751 12.886 19.9511 12.958 19.8791 13.006C19.7831 13.054 19.7111 13.018 19.6631 12.898L19.4111 12.322L19.1951 11.818V11.782H19.159L19.0871 11.458C19.0631 11.482 19.0391 11.518 19.0151 11.566C18.9911 11.614 18.9671 11.662 18.9431 11.71L19.1951 12.286L19.3751 12.934L19.6631 13.546C19.6871 13.642 19.6511 13.714 19.5551 13.762C19.4591 13.81 19.3871 13.774 19.3391 13.654L19.0871 13.042L19.0511 13.006L18.9071 12.394L18.6911 11.998C18.6431 12.094 18.607 12.154 18.583 12.178V12.214L18.7271 12.754L19.0151 13.258L19.3031 13.87C19.3511 13.966 19.3271 14.038 19.2311 14.086C19.135 14.11 19.0631 14.086 19.0151 14.014L18.7271 13.402L18.4391 12.898V12.862L18.3311 12.538C18.3071 12.586 18.2831 12.634 18.2591 12.682C18.2351 12.73 18.2111 12.778 18.1871 12.826L18.4031 13.366L18.6191 13.942L18.9071 14.59C18.9311 14.686 18.9071 14.758 18.8351 14.806C18.739 14.854 18.6671 14.818 18.6191 14.698L18.3311 14.086L18.0791 13.474L17.9711 13.15C17.923 13.198 17.8871 13.246 17.8631 13.294C17.8391 13.342 17.8151 13.39 17.791 13.438L18.0791 13.942L18.2951 14.482L18.5831 15.094C18.6311 15.19 18.6071 15.262 18.5111 15.31C18.4151 15.358 18.3431 15.334 18.2951 15.238L18.0071 14.626L17.791 14.086L17.6111 13.762C17.5151 13.834 17.4551 13.93 17.4311 14.05L17.6471 14.59L17.9351 15.166L18.1871 15.814C18.2351 15.91 18.2111 15.982 18.1151 16.03C18.0191 16.078 17.9471 16.042 17.8991 15.922L17.6111 15.31L17.3591 14.698L17.215 14.374C17.119 14.47 17.0591 14.554 17.0351 14.626L17.2511 15.202L17.4311 15.814L17.6831 16.354C17.7311 16.45 17.695 16.522 17.5751 16.57C17.503 16.594 17.4311 16.57 17.3591 16.498L17.1431 15.958L17.1071 15.922L16.9631 15.31L16.7831 14.914C16.7351 15.01 16.6751 15.094 16.6031 15.166L16.7831 15.598H16.8191L16.9631 16.174L17.1431 16.678C17.1671 16.774 17.1311 16.846 17.0351 16.894C16.9151 16.894 16.8431 16.858 16.8191 16.786L16.6751 16.246L16.4951 15.706L16.3511 15.418C16.3271 15.466 16.2791 15.526 16.2071 15.598C16.2071 15.598 16.2071 15.61 16.2071 15.634C16.1831 15.634 16.1711 15.646 16.1711 15.67L16.423 16.282L16.6751 16.858L16.8911 17.398C16.9151 17.494 16.8791 17.566 16.7831 17.614C16.7111 17.662 16.6511 17.626 16.6031 17.506L16.3871 17.002L16.0991 16.426V16.39L15.9551 15.958C15.9071 15.982 15.8711 16.018 15.8471 16.066C15.8231 16.114 15.8111 16.198 15.8111 16.318L16.0631 16.858L16.2791 17.362H16.3151V17.398L16.4591 17.938C16.4831 18.034 16.4471 18.106 16.3511 18.154C16.2311 18.154 16.1711 18.118 16.1711 18.046L15.9911 17.506L15.7751 17.002L15.5231 16.462C15.4991 16.51 15.4511 16.57 15.3791 16.642L15.4871 16.858C15.4871 16.882 15.4991 16.894 15.5231 16.894L15.6671 17.47L15.9551 18.046L16.1711 18.694C16.1951 18.79 16.1711 18.862 16.0991 18.91C16.0031 18.958 15.9311 18.922 15.8831 18.802L15.6311 18.19L15.3791 17.614V17.578L15.1631 16.93C15.1151 17.002 15.0551 17.074 14.9831 17.146C14.9111 17.218 14.8391 17.29 14.7671 17.362L14.8751 17.614V17.65L15.0551 18.19L15.2351 18.766L15.4511 19.414C15.4751 19.51 15.4511 19.582 15.3791 19.63C15.2591 19.63 15.1871 19.594 15.1631 19.522L14.9111 18.91V18.874L14.7311 18.298L14.5871 17.758L14.4791 17.542C14.3111 17.638 14.1071 17.71 13.8671 17.758L13.9031 17.938L14.1911 18.55L14.4791 19.054V19.09L14.6231 19.702C14.6471 19.798 14.6111 19.87 14.5151 19.918C14.4191 19.918 14.3591 19.882 14.3351 19.81L14.1551 19.198L13.9031 18.694L13.6151 18.082V18.046L13.5431 17.794C13.5191 17.794 13.5071 17.806 13.5071 17.83C13.5071 17.83 13.4951 17.83 13.4711 17.83H13.4351L13.7231 18.442L13.9031 19.09L14.0471 19.666C14.0711 19.762 14.0351 19.834 13.9391 19.882C13.8431 19.882 13.7831 19.846 13.7591 19.774L13.5791 19.162L13.4351 18.55L13.0751 17.83V17.794C12.9791 17.794 12.9191 17.806 12.8951 17.83L12.9311 17.866L13.0751 18.37L13.291 18.91L13.5071 19.486C13.5551 19.582 13.5311 19.654 13.4351 19.702C13.3391 19.75 13.2671 19.714 13.2191 19.594L12.9671 19.054L12.7871 18.478L12.5351 17.794H12.463C12.463 17.794 12.463 17.806 12.463 17.83C12.4391 17.83 12.4271 17.854 12.4271 17.902L12.7151 18.478L12.9311 19.018L13.1111 19.594C13.1351 19.69 13.1111 19.762 13.0391 19.81C12.9191 19.81 12.8471 19.774 12.8231 19.702L12.6071 19.126L12.4271 18.586L12.1391 18.046L12.0311 17.758C11.9591 17.758 11.8871 17.758 11.8151 17.758C11.7431 17.758 11.6711 17.746 11.5991 17.722L12.1031 18.802L12.3911 19.306C12.4151 19.402 12.3911 19.474 12.3191 19.522C12.1991 19.57 12.1271 19.546 12.1031 19.45L11.8151 18.946L11.5631 18.406L11.2751 17.758L11.3471 17.938L11.5271 18.478C11.5511 18.574 11.5271 18.646 11.4551 18.694C11.3591 18.742 11.2871 18.706 11.2391 18.586L11.0231 18.046L10.9511 17.974L10.7711 17.578L10.6631 17.686C10.5911 17.71 10.519 17.674 10.4471 17.578L10.2311 17.002C10.1111 17.002 10.0391 16.966 10.0151 16.894L9.90705 16.462C9.81105 16.462 9.76305 16.426 9.76305 16.354L9.61905 15.886L9.51105 15.994C9.41505 16.042 9.34305 16.006 9.29505 15.886L9.11505 15.382C9.01905 15.382 8.95905 15.346 8.93505 15.274L8.82705 14.878C8.75505 14.878 8.70705 14.854 8.68305 14.806L8.35905 14.086C8.26305 14.086 8.20305 14.05 8.17905 13.978L8.03505 13.618C7.96305 13.618 7.91505 13.582 7.89105 13.51L7.74705 13.15C7.67505 13.102 7.61505 13.042 7.56705 12.97H7.53105C7.43505 12.97 7.37505 12.934 7.35105 12.862L7.27905 12.574L7.17105 12.466C7.09905 12.466 7.05105 12.442 7.02705 12.394L6.84705 11.998C6.82305 11.95 6.79905 11.914 6.77505 11.89C6.75105 11.842 6.72705 11.806 6.70305 11.782C6.63105 11.782 6.58305 11.746 6.55905 11.674L6.52305 11.494C6.47505 11.446 6.45105 11.41 6.45105 11.386C6.42705 11.386 6.41505 11.398 6.41505 11.422C6.31905 11.47 6.24705 11.434 6.19905 11.314L5.91105 10.702L5.62305 10.054C5.62305 10.054 5.59905 10.078 5.55105 10.126C5.45505 10.174 5.38305 10.15 5.33505 10.054L5.08305 9.51403V9.47803L4.93905 9.01003C4.91505 9.01003 4.90305 9.02203 4.90305 9.04603C4.90305 9.04603 4.89105 9.04603 4.86705 9.04603C4.79505 9.07003 4.72305 9.03403 4.65105 8.93803L4.39905 8.32603L4.18305 7.78603C4.20705 7.88203 4.17105 7.95403 4.07505 8.00203C3.95505 8.00203 3.89505 7.96603 3.89505 7.89403L3.67905 7.10203C3.63105 7.15003 3.60705 7.17403 3.60705 7.17403C3.48705 7.17403 3.41505 7.13803 3.39105 7.06603L3.28305 6.77803L3.24705 6.81403C3.12705 6.81403 3.05505 6.77803 3.03105 6.70603L2.85105 6.05803C2.77905 6.05803 2.73105 6.02203 2.70705 5.95003L2.56305 5.59003C2.56305 5.56603 2.56305 5.55403 2.56305 5.55403C2.53905 5.55403 2.52705 5.54203 2.52705 5.51803C2.50305 5.54203 2.49105 5.56603 2.49105 5.59003C2.46705 5.59003 2.44305 5.60203 2.41905 5.62603C2.29905 5.62603 2.22705 5.59003 2.20305 5.51803L2.09505 5.08603L2.05905 5.12203C1.93905 5.14603 1.86705 5.11003 1.84305 5.01403L1.59105 4.33003C1.51905 4.28203 1.48305 4.24603 1.48305 4.22203L1.33905 3.75403C1.33905 3.73003 1.31505 3.69403 1.26705 3.64603C1.21905 3.52603 1.15905 3.43003 1.08705 3.35803C1.01505 3.26203 0.95505 3.16603 0.907049 3.07003C0.811049 2.95003 0.727049 2.84203 0.65505 2.74603C0.55905 2.62603 0.48705 2.48203 0.439049 2.31403C0.439049 2.31403 0.415049 2.26603 0.36705 2.17003C0.319049 2.07403 0.283049 1.95403 0.259049 1.81003C0.235049 1.66603 0.295049 1.51003 0.439049 1.34203C0.559049 1.17403 0.691049 1.01803 0.83505 0.874031C0.95505 0.706031 1.11105 0.562031 1.30305 0.442031C1.39905 0.370031 1.49505 0.334031 1.59105 0.334031C1.68705 0.334031 1.79505 0.334031 1.91505 0.334031L2.20305 0.334031C2.29905 0.334031 2.40705 0.334031 2.52705 0.334031C2.62305 0.310031 2.74305 0.298031 2.88705 0.298031C3.51105 0.22603 4.14705 0.16603 4.79505 0.118031C5.44305 0.0700314 6.07905 0.0700314 6.70305 0.118031C7.06305 0.14203 7.39905 0.190031 7.71105 0.262031C8.02305 0.310031 8.32305 0.454031 8.61105 0.694031C8.82705 0.862031 9.01905 1.10203 9.18705 1.41403C9.33105 1.70203 9.48705 1.97803 9.65505 2.24203C9.89505 2.62603 10.135 2.99803 10.375 3.35803C10.5911 3.71803 10.819 4.07803 11.0591 4.43803C11.371 4.89403 11.6711 5.36203 11.9591 5.84203C12.2231 6.29803 12.5111 6.76603 12.8231 7.24603C13.135 6.79003 13.4591 6.33403 13.795 5.87803C14.107 5.42203 14.4071 4.95403 14.6951 4.47403C14.911 4.09003 15.1391 3.70603 15.3791 3.32203C15.5951 2.91403 15.8111 2.51803 16.0271 2.13403C16.1711 1.89403 16.3271 1.63003 16.4951 1.34203C16.639 1.03003 16.819 0.79003 17.035 0.62203C17.347 0.38203 17.6831 0.250031 18.0431 0.226031C18.3791 0.20203 18.727 0.20203 19.087 0.226031C19.159 0.250031 19.243 0.26203 19.3391 0.26203C19.4111 0.26203 19.4951 0.26203 19.5911 0.26203C19.9031 0.26203 20.215 0.26203 20.5271 0.26203C20.8391 0.26203 21.163 0.250031 21.4991 0.226031C21.739 0.226031 21.9791 0.226031 22.2191 0.226031C22.4591 0.20203 22.7111 0.190029 22.975 0.190029L23.875 0.190029C24.115 0.14203 24.3191 0.16603 24.4871 0.26203C24.6791 0.35803 24.8351 0.490029 24.9551 0.658029C25.0751 0.826029 25.2071 0.98203 25.3511 1.12603C25.4471 1.22203 25.4111 1.34203 25.2431 1.48603ZM24.4151 1.34203C24.3671 1.29403 24.3191 1.23403 24.2711 1.16203C24.1991 1.09003 24.1271 1.04203 24.055 1.01803C24.031 0.99403 23.9951 0.99403 23.9471 1.01803C23.875 1.01803 23.8151 1.01803 23.767 1.01803C23.719 1.04203 23.6591 1.05403 23.5871 1.05403H22.975C22.7111 1.05403 22.4591 1.06603 22.2191 1.09003C21.9791 1.09003 21.739 1.09003 21.4991 1.09003C21.163 1.11403 20.8391 1.12603 20.5271 1.12603C20.191 1.12603 19.8671 1.12603 19.555 1.12603C19.483 1.12603 19.4111 1.12603 19.3391 1.12603C19.267 1.12603 19.1831 1.11403 19.087 1.09003C18.823 1.06603 18.559 1.06603 18.295 1.09003C18.031 1.09003 17.791 1.16203 17.5751 1.30603C17.4071 1.42603 17.2631 1.61803 17.1431 1.88203C16.9991 2.14603 16.8791 2.37403 16.7831 2.56603C16.5431 2.95003 16.3151 3.34603 16.0991 3.75403C15.8831 4.13803 15.6551 4.52203 15.4151 4.90603C15.1271 5.41003 14.8151 5.90203 14.4791 6.38203C14.1431 6.86203 13.8071 7.34203 13.4711 7.82203C13.3751 7.96603 13.3031 8.12203 13.2551 8.29003C13.2071 8.45803 13.0631 8.54203 12.8231 8.54203C12.6551 8.54203 12.5471 8.49403 12.4991 8.39803C12.4271 8.30203 12.3671 8.20603 12.3191 8.11003C12.2711 7.99003 12.2231 7.90603 12.1751 7.85803C11.8391 7.37803 11.5271 6.88603 11.2391 6.38203C10.9511 5.87803 10.6511 5.38603 10.3391 4.90603C10.0991 4.52203 9.85905 4.15003 9.61905 3.79003C9.37905 3.43003 9.15105 3.07003 8.93505 2.71003C8.81505 2.49403 8.68305 2.25403 8.53905 1.99003C8.39505 1.72603 8.23905 1.52203 8.07105 1.37803C7.85505 1.18603 7.62705 1.07803 7.38705 1.05403C7.14705 1.03003 6.90705 1.00603 6.66705 0.98203C6.04305 0.93403 5.43105 0.93403 4.83105 0.98203C4.23105 1.03003 3.63105 1.07803 3.03105 1.12603C2.98305 1.12603 2.95905 1.13803 2.95905 1.16203C2.93505 1.16203 2.91105 1.16203 2.88705 1.16203C2.76705 1.16203 2.65905 1.17403 2.56305 1.19803C2.44305 1.19803 2.33505 1.19803 2.23905 1.19803H2.05905C1.93905 1.15003 1.83105 1.15003 1.73505 1.19803C1.61505 1.27003 1.51905 1.36603 1.44705 1.48603C1.35105 1.58203 1.25505 1.69003 1.15905 1.81003C1.18305 1.83403 1.20705 1.88203 1.23105 1.95403C1.25505 2.00203 1.26705 2.05003 1.26705 2.09803C1.29105 2.19403 1.35105 2.27803 1.44705 2.35003C1.51905 2.42203 1.57905 2.50603 1.62705 2.60203C1.67505 2.69803 1.73505 2.79403 1.80705 2.89003C1.87905 2.96203 1.93905 3.05803 1.98705 3.17803C2.15505 3.44203 2.33505 3.71803 2.52705 4.00603C2.69505 4.29403 2.87505 4.58203 3.06705 4.87003C3.85905 5.66203 4.55505 6.56203 5.15505 7.57003C5.73105 8.55403 6.31905 9.55003 6.91905 10.558C7.49505 11.542 8.17905 12.43 8.97105 13.222V13.258H9.00705C9.24705 13.618 9.48705 13.99 9.72705 14.374C9.94305 14.734 10.1711 15.094 10.4111 15.454C10.5071 15.622 10.6271 15.838 10.7711 16.102C10.9151 16.366 11.0711 16.558 11.2391 16.678C11.4071 16.798 11.6111 16.87 11.8511 16.894C12.0671 16.918 12.2951 16.93 12.5351 16.93H12.8951C12.9671 16.93 13.0271 16.942 13.0751 16.966H13.3271C13.4711 16.942 13.6151 16.918 13.7591 16.894C13.8791 16.87 13.9991 16.822 14.1191 16.75C14.2391 16.678 14.3471 16.582 14.4431 16.462C14.5151 16.318 14.5991 16.198 14.6951 16.102L15.5591 15.022C16.0391 14.542 16.4591 14.014 16.8191 13.438C17.1791 12.838 17.5391 12.25 17.8991 11.674C18.2591 11.074 18.6911 10.534 19.1951 10.054V10.018C19.1711 9.94603 19.2071 9.88603 19.3031 9.83803H19.3391C19.4351 9.74203 19.5191 9.62203 19.5911 9.47803C19.5191 9.35803 19.543 9.29803 19.663 9.29803C19.687 9.27403 19.7231 9.26203 19.7711 9.26203C19.7951 9.21403 19.8311 9.16603 19.8791 9.11803C19.9031 9.04603 19.9391 8.97403 19.9871 8.90203C19.9151 8.78203 19.9391 8.72203 20.0591 8.72203C20.0831 8.69803 20.107 8.68603 20.1311 8.68603L20.3471 8.25403C20.3471 8.23003 20.371 8.19403 20.4191 8.14603C20.659 7.73803 20.8991 7.33003 21.1391 6.92203C21.3551 6.51403 21.6191 6.14203 21.9311 5.80603C22.2431 5.32603 22.5671 4.84603 22.9031 4.36603C23.2151 3.86203 23.5271 3.35803 23.8391 2.85403C24.1271 2.47003 24.3671 2.08603 24.5591 1.70203C24.4391 1.70203 24.3911 1.58203 24.4151 1.34203Z"
      fill="#FBFBFB"
    />
  </svg>
)
