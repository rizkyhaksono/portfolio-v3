import Image from "next/image"

export default function GreetingSection() {
  return (
    <div className="h-screen">
      <div className="grid grid-cols-8">
        <div className="bg-gray-500 col-span-1 flex flex-col items-start justify-center">
          <button>Instagram</button>
          <button>Github</button>
          <button>X</button>
        </div>
        <div className="bg-red-500 col-span-6">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque sunt quis cumque esse. Impedit in et earum culpa, necessitatibus aliquam voluptatem, laboriosam possimus, magnam quis vel temporibus animi deserunt numquam.
        </div>
        <div className="bg-green-500 col-span-1">
          {/* <Image src="" />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor, quaerat neque possimus dolorum qui ipsa accusantium, unde quo nesciunt eos molestiae iure minus voluptas maiores deleniti repudiandae velit dolore voluptate. */}
        </div>
      </div>
      <div className="flex flex-col w-fit mt-10">
        <div className="bg-gray-500">Button</div>
        <div className="bg-gray-500">Button</div>
      </div>
    </div>
  )
}
