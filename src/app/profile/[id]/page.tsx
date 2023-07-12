interface UserProfileProps {
  params: {
    id: string;
  };
}

export default function UserProfile({ params }: UserProfileProps) {
  return (
    <div>
      <h1>
        Profile Page <span className="bg-yellow-600 p-2">{params.id}</span>
      </h1>
    </div>
  );
}
