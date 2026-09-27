using UnityEngine;

// 발판으로서 필요한 동작을 담은 스크립트
public class PlatformObstaclesRandom : MonoBehaviour {
    public GameObject[] obstacles; // 장애물 오브젝트들
    private bool stepped = false; // 플레이어 캐릭터가 밟았었는가

    // 컴포넌트가 활성화될때 마다 매번 실행되는 메서드
    private void OnEnable() {
        // 발판을 리셋하는 처리
        stepped = false;

        for (int i = 0; i < obstacles.Length; i++) {
            if (Random.Range(0, 2) == 0) {
                obstacles[i].SetActive(true);
            } else {
                obstacles[i].SetActive(false);
            }
        }

    }
}
