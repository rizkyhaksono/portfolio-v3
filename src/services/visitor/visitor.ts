export const getVisitorInfo = async () => {
  const response = await fetch("http://localhost:3000/api/visitor", {
    method: "GET",
    next: {
      revalidate: 0,
    }
  })
  return await response.json();
}