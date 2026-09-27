using UnityEngine;

public class BeatBeat : MonoBehaviour {
    public float targetTime;
    public float noteSpeed;

    private RhythmManager rhythmManager;
    private float xOffset;
    private float yOffset;

    void Start() {
        // RhythmManager 싱글톤 우선, 없으면 씬 탐색
        rhythmManager = RhythmManager.Instance ?? FindObjectOfType<RhythmManager>();

        // MapParser가 Instantiate 직후 설정한 localPosition에서
        // 레인(x)·높이(y) 오프셋을 기억해 둔다.
        // Start()는 Instantiate 다음 프레임에 실행되므로
        // MapParser가 설정한 값을 올바르게 읽는다.
        xOffset = transform.localPosition.x;
        yOffset = transform.localPosition.y;
    }

    void Update() {
        if (rhythmManager == null) return;
        if (!rhythmManager.countdownDone) return;

        float currentTime = rhythmManager.GetCurrentNoteTime();

        // 핵심 공식: (도착시간 - 현재시간) * 속도 = 판정선까지 남은 거리
        float distance = (targetTime - currentTime) * noteSpeed;

        // x·y 레인 위치를 유지하면서 Z축만 이동
        transform.localPosition = new Vector3(xOffset, yOffset, distance);

        if (distance < -2f)
            Destroy(gameObject);
    }
}
