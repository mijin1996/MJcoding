using UnityEngine;

public class ButtonClickEffect : MonoBehaviour {
    [Header("--- 클릭 이펙트 설정 ---")]
    public GameObject clickEffectPrefab;
    public float destroyDelay = 2f;

    // 이 함수를 버튼의 OnClick()에 연결해서 사용합니다.
    public void PlayClickEffect() {
        if (clickEffectPrefab == null) return;

        // 이 스크립트는 버튼에 직접 붙어있으므로
        // transform.position은 정확히 "이 버튼"의 위치입니다.
        Vector3 buttonPosition = transform.position;

        GameObject effect = Instantiate(clickEffectPrefab, buttonPosition, Quaternion.identity);

        // 버튼과 같은 부모(Canvas/패널) 안으로 넣어 UI 레이어에 맞게 표시합니다.
        effect.transform.SetParent(transform.parent, false);
        effect.transform.position = buttonPosition;
        effect.transform.localScale = Vector3.one;

        Destroy(effect, destroyDelay);
    }
}
