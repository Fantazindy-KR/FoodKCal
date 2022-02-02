export async function getFoods() {
  const response = await fetch("https://learn.codeit.kr/api/foods");
  const body = await response.json();
  return body;
}
