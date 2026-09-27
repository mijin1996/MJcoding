using UnityEngine;
using System.IO; // ◀ 파일 경로(Path) 및 읽기(File)를 위해 반드시 필요!

public class MapParser : MonoBehaviour {
    [Header("맵 설정")]
    public string jsonFileName = "Expert.dat";
    public float bpm = 120f;
    public float noteSpeed = 10f;      // 노트 이동 속도 (초당 유닛)
    public float spawnDistance = 15f;  // 노트 스폰 거리 (판정선 기준 앞쪽)

    [Header("프리팹")]
    public GameObject redNotePrefab;   // 왼손(빨강) 노트 — Cube + Note 컴포넌트 필요
    public GameObject blueNotePrefab;  // 오른손(파랑) 노트 — Cube + Note 컴포넌트 필요
    public GameObject bombPrefab;      // 폭탄 (선택, 없으면 스킵)

    [Header("판정선 기준 Transform")]
    public Transform judgmentLine;

    [Header("결과 화면")]
    // public GameResultUI gameResultUI; // 현재 주석 처리됨
    public float resultDelay = 3f;

    // ── 내부 상태 ──
    private BeatSageMapData mapData;
    private int noteIndex = 0;
    private bool isLoaded = false;
    private float secondsPerBeat;
    private float travelTime;
    private bool spawningComplete = false;
    private bool resultTriggered  = false;

    void Start() {
        secondsPerBeat = 60f / bpm;
        travelTime = spawnDistance / noteSpeed;
        LoadMap();

        if (RhythmManager.Instance != null)
            RhythmManager.Instance.OnMusicEnd += () => spawningComplete = true;
    }

    void LoadMap() {
        string filePath = Path.Combine(Application.streamingAssetsPath, jsonFileName);
        if (!File.Exists(filePath)) {
            Debug.LogError($"[MapParser] 파일 없음: {filePath}\n" +
                           "StreamingAssets 폴더에 .dat 파일을 넣었는지 확인하세요.");
            return;
        }

        string json = File.ReadAllText(filePath);
        mapData = JsonUtility.FromJson<BeatSageMapData>(json);

        if (mapData == null || mapData._notes == null || mapData._notes.Length == 0) {
            Debug.LogError("[MapParser] JSON 파싱 실패 또는 노트가 0개입니다. 파일 형식을 확인하세요.");
            return;
        }

        isLoaded = true;
        Debug.Log($"[MapParser] 맵 로드 성공 — BPM:{bpm}  총 노트:{mapData._notes.Length}  travelTime:{travelTime:F2}s");
    }

    void Update() {
        // Cube.ActiveCount 및 컴포넌트 에러 방지를 위해 임시 주석 처리하거나 검사 필요
        // 만약 Cube 클래스가 없거나 ActiveCount가 없다면 이 줄도 에러가 납니다.
        // 에러가 지속된다면 아래 if문 조건을 수정해야 할 수 있습니다.
        if (spawningComplete && !resultTriggered) {
            resultTriggered = true;
            StartCoroutine(ShowResultAfterDelay(resultDelay));
        }

        if (!isLoaded) return;
        if (!RhythmManager.Instance.countdownDone) return; //📌 카운트 다운 후 노래가 나오도록

        RhythmManager rm = RhythmManager.Instance;
        if (rm == null || !rm.musicSource.isPlaying) return;
        if (!rm.countdownDone) return; //📌
        //float currentMusicTime = rm.GetCurrentMusicTime();
        float currentMusicTime = rm.GetCurrentNoteTime();

        while (noteIndex < mapData._notes.Length) {
            BeatSageNote note = mapData._notes[noteIndex];
            float arrivalTime = note._time * secondsPerBeat;
            float spawnTime = arrivalTime - travelTime;

            if (currentMusicTime >= spawnTime) {
                SpawnNote(note, arrivalTime, currentMusicTime);
                noteIndex++;
            } else {
                break;
            }
        }
    }

    void SpawnNote(BeatSageNote note, float arrivalTime, float currentMusicTime) {
        GameObject prefab = null;
        if (note._type == 3) prefab = bombPrefab;
        else if (note._type == 0) prefab = redNotePrefab;
        else prefab = blueNotePrefab;

        if (prefab == null) return;

        float x = (note._lineIndex - 1.5f) * 0.6f;
        float y = 0.3f + note._lineLayer * 0.5f;

        float initialZ = (arrivalTime - currentMusicTime) * noteSpeed;
        initialZ = Mathf.Max(0f, initialZ);

        GameObject obj = Instantiate(prefab, judgmentLine);
        obj.transform.localPosition = new Vector3(x, y, initialZ);

        // Note 컴포넌트 유무 확인 (Note 스크립트가 프로젝트에 있어야 함)
        // 만약 'Note' 클래스가 없다면 이 부분에서 컴파일 에러가 발생하므로 일반 GameObject로 테스트 후 해제하세요.

        if (obj.TryGetComponent<BeatBeat>(out var noteComp)) {
            noteComp.targetTime = arrivalTime;
            noteComp.noteSpeed = noteSpeed;
        }


        if (note._type != 3)
            obj.transform.localRotation = Quaternion.Euler(0f, 0f, GetCutAngle(note._cutDirection));
    }

    System.Collections.IEnumerator ShowResultAfterDelay(float delay) {
        yield return new WaitForSeconds(delay);
        // gameResultUI 관련 에러 방지를 위해 로그 처리로 대체
        Saber[] sabers = FindObjectsOfType<Saber>();
        foreach (var saber in sabers) {
            if (saber.trail != null)
                saber.trail.emitting = false;  // ← 즉시 끔, 잔상은 time 값에 따라 서서히 사라짐
        }
        Debug.Log("게임 결과 화면 표시 시점");
    }

    float GetCutAngle(int cutDirection) {
        switch (cutDirection) {
            case 0: return 0f;
            case 1: return 180f;
            case 2: return 90f;
            case 3: return 270f;
            case 4: return 45f;
            case 5: return 315f;
            case 6: return 135f;
            case 7: return 225f;
            default: return 0f;
        }
    }
}
