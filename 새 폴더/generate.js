// Vercel Serverless Function
export default async function handler(req, res) {
  const { type, atpt, name } = req.query;
  const KEY = process.env.NEIS_API_KEY;

  // 1. 학교 코드 조회
  const schoolRes = await fetch(`https://open.neis.go.kr/hub/schoolInfo?KEY=${KEY}&Type=json&ATPT_OFCDC_SC_CODE=${atpt}&SCHUL_NM=${encodeURIComponent(name)}`);
  const schoolData = await schoolRes.json();
  const sdCode = schoolData.schoolInfo[1].row[0].SD_SCHUL_CODE;

  // 2. 급식 또는 학사일정 호출
  const endpoint = type === 'meal' ? 'mealServiceDietInfo' : 'SchoolSchedule';
  const dataRes = await fetch(`https://open.neis.go.kr/hub/${endpoint}?KEY=${KEY}&Type=json&ATPT_OFCDC_SC_CODE=${atpt}&SD_SCHUL_CODE=${sdCode}`);
  const finalData = await dataRes.json();

  res.status(200).json(finalData);
}