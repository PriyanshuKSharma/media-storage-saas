import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md -mt-16">
        <SignUp />
      </div>
    </div>
  )
}