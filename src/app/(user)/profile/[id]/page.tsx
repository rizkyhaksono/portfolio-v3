import { notFound } from "next/navigation";

type EditProfileProps = {
  params: Promise<{ id: string }>;
};

const EditProfile = async (props: EditProfileProps) => {
  if (!(await props.params).id) return notFound();

  return (
    <div>
      <h1>Edit Profile</h1>
    </div>
  );
}

export default EditProfile;